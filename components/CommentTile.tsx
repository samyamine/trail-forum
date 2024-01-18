"use client";

import Votes from "@/components/Votes";
import Share from "@/components/Share";
import {TbBookmark, TbBookmarkFilled, TbFlag, TbMessageCircle, TbTrash} from "react-icons/tb";
import {SlOptions} from "react-icons/sl";
import React, {useEffect, useState} from "react";
import {IComment, ITopic, IUser} from "@/lib/interfaces";
import {
    addDoc, arrayRemove,
    arrayUnion,
    collection,
    doc, DocumentData,
    DocumentReference, DocumentSnapshot,
    getDoc,
    Timestamp,
    updateDoc
} from "@firebase/firestore";
import toast, {Toaster} from "react-hot-toast";
import {isUndefined} from "@/lib/utils";
import {db} from "@/lib/firebase/config";
import {useAuth} from "@/app/authContext";
import {usePopup} from "@/app/popupContext";
import {formatTime} from "@/lib/topic/utils";

const REPLY_MAX_LENGTH = 500;

export default function CommentTile({ comment }: { comment: IComment | DocumentReference }) {
    const {userData, user} = useAuth();
    const {showPopup} = usePopup();

    const [showReportOption, setReportOption] = useState(false);
    const [commentData, setCommentData] = useState<IComment | null>(null);
    const [reply, setReply] = useState("");
    const [replyTooLong, setReplyTooLong] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleSave = async () => {
        if (isUndefined(userData)) {
            showPopup();
        }
        else if (isSaved()) {
            const authorRef = commentData?.author as DocumentReference;
            const author = await getDoc(authorRef) as DocumentSnapshot;
            const authorData = author.data() as DocumentData;

            for (const ref of authorData.saved as DocumentReference[]) {
                if (ref.id === commentData?.uid) {
                    await updateDoc(authorRef, {
                        saved: arrayRemove(ref),
                    });

                    return;
                }
            }
        }
        else {
            const authorRef = commentData?.author as DocumentReference;

            await updateDoc(authorRef, {
                saved: arrayUnion(doc(db, "comments", String(commentData?.uid))),
            });

            toast.success("Comment saved on your profile");
        }
    };

    const isSaved = (): boolean => {
        if (!isUndefined(userData)) {
            const saved = userData?.saved as (IComment | ITopic)[];

            for (const element of saved) {
                if (element.uid === commentData?.uid) {
                    return true;
                }
            }
        }

        return false;
    };

    const postReply = async () => {
        setLoading(true);
        if (isUndefined(userData)) {
            setLoading(false);
            showPopup();
        }
        else if (reply.length === 0) {
            throw new Error("Comment is too short");
        }
        else {
            const myUserData = userData as IUser;
            const authorRef = doc(db, "users", myUserData.uid);
            const commentRef = await addDoc(collection(db, "comments"), {
                answers: [],
                author: authorRef,
                body: reply,
                creationDate: Date.now(),
                parentComment: doc(db, "comments", String(commentData?.uid)),
                topicRef: commentData?.topicRef,
                upVoted: [],
                downVoted: [],
            });

            // DOCS: Add to parent comment
            await updateDoc(doc(db, "comments", String(commentData?.uid)), {
                answers: arrayUnion(commentRef),
            });

            // DOCS: Add to user comments
            await updateDoc(authorRef, {
                comments: arrayUnion(commentRef),
            });

            // DOCS: Reload page
            setLoading(false);
            window.location.reload();
        }
    };

    const setNewReply = (text: string) => {
        if (text.length <= REPLY_MAX_LENGTH) {
            setReply(text);

            if (replyTooLong) {
                setReplyTooLong(false);
            }
        }
        else {
            setReplyTooLong(true);
        }
    };

    useEffect(() => {
        const getData = async () => {
            if (comment instanceof DocumentReference) {
                const commentSnapshot = await getDoc(comment);

                if (!commentSnapshot.exists() || isUndefined(commentSnapshot.data())) {
                    throw new Error("Comment does not exist");
                }

                setCommentData({
                    uid: commentSnapshot.id,
                    answers: commentSnapshot.data().answers,
                    author: commentSnapshot.data().author,
                    body: commentSnapshot.data().body,
                    creationDate: commentSnapshot.data().creationDate,
                    parentComment: commentSnapshot.data().parentComment,
                    topicRef: commentSnapshot.data().topicRef,
                    upVoted: commentSnapshot.data().upVoted,
                    downVoted: commentSnapshot.data().downVoted,
                });
            }
            else {
                setCommentData(comment);
            }
        };

        getData().catch((error) => toast.error(error.message));
    }, []);

    return commentData !== null && (
        <>
            <Toaster />
            <div className={`w-full py-3 text-gray-900`}>
                <div className={`flex justify-between items-center`}>
                    <div className={`mb-2 flex items-center gap-2`}>
                        <div className={`w-6 h-6 bg-red-400 rounded-full`}></div>
                        <p className={`font-bold text-sm`}>
                            user - <span className={`font-normal text-gray-500`}>{formatTime(commentData.creationDate.seconds)}</span>
                        </p>
                    </div>

                    <div className={`${showReportOption && "bg-gray-200"} w-fit h-fit p-2 rounded-full relative hover:bg-gray-200 
                cursor-pointer`} onClick={() => setReportOption(!showReportOption)}>
                        <SlOptions />

                        {showReportOption && (
                            <div className={`absolute top-7 right-0 bg-white shadow-md border-[1px] border-black z-50`}>
                                <div className={`px-5 py-3 flex items-center gap-2 hover:bg-gray-200 active:bg-gray-200`}
                                     onClick={() => toggleSave().catch((error) => console.log(error.message))}>
                                    {isSaved() ? (
                                        <>
                                            <TbBookmarkFilled />
                                            <p className={`text-sm`}>
                                                Remove
                                            </p>
                                        </>
                                    ): (
                                        <>
                                            <TbBookmark />
                                            <p className={`text-sm`}>
                                                Save
                                            </p>
                                        </>
                                    )}
                                </div>

                                {userData?.uid === commentData.author.id && (
                                    <div className={`px-5 py-3 flex items-center gap-2 hover:bg-gray-200 active:bg-gray-200`}
                                         onClick={() => toggleSave().catch((error) => console.log(error.message))}>
                                        <TbTrash />
                                        <p className={`text-sm`}>
                                            Delete
                                        </p>
                                    </div>
                                )}

                                <div className={`px-5 py-3 flex items-center gap-2 hover:bg-red-200 active:bg-red-200 text-red-500`}
                                     onClick={() => toast.success("We have received your report notification")}>
                                    <TbFlag />
                                    <p className={`text-sm`}>
                                        Report
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <h1 className={`mb-4 pl-5 pr-3 text-sm`}>
                    {commentData.body}
                </h1>

                <div className={`pl-5 pr-3 flex gap-5`}>
                    <Votes id={commentData.uid} collection={`comments`} initCount={commentData.upVoted.length - commentData.downVoted.length} />
                    <div className={`px-2 rounded-full cursor-pointer flex gap-1 items-center border-[1px] border-black 
                hover:bg-gray-300 ${showReply && "bg-gray-300"} text-xs`}
                         onClick={() => setShowReply(!showReply)}>
                        <div>
                            <TbMessageCircle />
                        </div>
                        <p className={`p-1`}>Reply</p>
                    </div>
                    <Share />
                </div>

                {showReply && (
                    <div className={`my-4 flex flex-col items-end gap-2`}>
                        <p className={`text-xs`}>{REPLY_MAX_LENGTH - reply.length}</p>
                        <textarea className={`w-full p-2 resize-none overflow-y-auto ${replyTooLong ? "bg-red-200" : "bg-gray-100"}
                        rounded-lg border-[1px] border-gray-400 text-sm placeholder-gray-400`}
                                  rows={5} cols={50} placeholder={`What is your opinion ?`} value={reply}
                                  onChange={(event) => setNewReply(event.target.value)}>
                        </textarea>

                        <div className={`w-full flex justify-between items-center`}>
                            <div className={`w-fit px-3 py-1 flex items-center gap-2 bg-orange-500 rounded-sm shadow-md 
                            active:shadow-sm text-white text-sm cursor-pointer`}
                                 onClick={() => postReply().catch((error) => console.log(error.message))}>
                                <p>{loading ? "Loading..." : "Reply"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}