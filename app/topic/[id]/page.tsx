"use client";

import {FaEllipsis} from "react-icons/fa6";
import Votes from "@/components/Votes";
import Share from "@/components/Share";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import React, {useEffect, useState} from "react";
import Divider from "@/components/Divider";
import CommentTile from "@/components/CommentTile";
import {TbBookmark, TbBookmarkFilled, TbFlag, TbMessageCircle2Filled, TbTrash} from "react-icons/tb";
import TopicCategory from "@/components/TopicCategory";
import {usePopup} from "@/app/popupContext";
import AuthPopup from "@/components/AuthPopup";
import {db} from "@/lib/firebase/config";
import {
    addDoc, arrayRemove, arrayUnion, collection, deleteDoc,
    doc, DocumentData,
    DocumentReference, DocumentSnapshot, getDoc, serverTimestamp,
    updateDoc,
} from "@firebase/firestore";
import toast, {Toaster} from "react-hot-toast";
import {useAuth} from "@/app/authContext";
import {IComment, ITopic, IUser} from "@/lib/interfaces";
import {getAuthor, getTopic, getComments, formatTime} from "@/lib/topic/utils";
import {isUndefined} from "@/lib/utils";
import UsernamePopup from "@/components/UsernamePopup";
import ProfilePicture from "@/components/ProfilePicture";
import Link from "next/link";

const COMMENT_MAX_LENGTH = 500;

interface IData {
    topic: ITopic,
    author: IUser,
    comments: IComment[],
    commentsNumber: number,
}

export default function TopicPage({ params }: { params: { id: string }}) {
    const {isPopupVisible, isUsernamePopupVisible, showPopup} = usePopup();
    const {userData} = useAuth();

    const [commentText, setCommentText] = useState("");
    const [commentTooLong, setCommentTooLong] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showReportOption, setShowReportOption] = useState(false);
    const [topicData, setTopicData] = useState<IData | null>(null);

    const deleteTopic = async () => {
        // FIXME
        // delete the topic
        // delete saved
        // delete topic reference in user
        // delete all comments and sub-comments related to this topic
        // delete all references to comments and sub-comments
        // delete all up/down votes

        for (const comment of topicData?.comments as IComment[]) {
            for (const answer of comment.answers) {
                await deleteComment(answer);
            }

            await deleteDoc(doc(db,"comments", comment.uid));
        }


    };

    const deleteComment = async (comment: DocumentReference) => {
        // FIXME

    };

    const deleteVote = async () => {
        // FIXME
    };

    const setNewComment = (text: string) => {
        if (text.length <= COMMENT_MAX_LENGTH) {
            setCommentText(text);

            if (commentTooLong) {
                setCommentTooLong(false);
            }
        }
        else {
            setCommentTooLong(true);
        }
    };

    const toggleSave = async () => {
        if (isUndefined(userData)) {
            showPopup();
        }
        else if (isSaved()) {
            const authorRef = doc(db, "users", String(userData?.uid));

            for (const ref of userData?.saved as (ITopic | IComment)[]) {
                if (ref.uid === params.id) {
                    await updateDoc(authorRef, {
                        saved: arrayRemove(ref),
                    });

                    return;
                }
            }
        }
        else {
            const authorRef = doc(db, "users", String(userData?.uid));

            await updateDoc(authorRef, {
                saved: arrayUnion(doc(db, "topics", String(params.id))),
            });

            toast.success("Comment saved on your profile");
        }
    };

    const isMyTopic = (): boolean => {
        if (isUndefined(userData)) {
            return false;
        }

        for (const topic of userData?.topics as ITopic[]) {
            if (topic.uid === params.id) {
                return true;
            }
        }

        return false;
    };

    const isSaved = (): boolean => {
        if (!isUndefined(userData)) {
            const saved = userData?.saved as (IComment | ITopic)[];

            for (const element of saved) {
                if (element.uid === params.id) {
                    return true;
                }
            }
        }

        return false;
    };

    const postComment = async () => {
        if (isUndefined(userData)) {
            showPopup();
        }
        else if (commentText.length === 0) {
            toast.error("Comment is too short");
        }
        else {
            const myUserData = userData as IUser;
            const topicRef = doc(db, "topics", params.id);
            const authorRef = doc(db, "users", myUserData.uid);

            const commentRef = await addDoc(collection(db, "comments"), {
                answers: [],
                author: authorRef,
                body: commentText,
                creationDate: serverTimestamp(),
                topicRef,
                upVoted: [],
                downVoted: [],
            });

            // FIXME: Add to topic comments
            await updateDoc(topicRef, {
                comments: arrayUnion(commentRef),
            });

            // FIXME: Add to user comments
            await updateDoc(authorRef, {
                comments: arrayUnion(commentRef),
            });

            // FIXME: Reload page
            window.location.reload();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const topicData = await getTopic(params.id);
            const authorData = await getAuthor(topicData.author);
            const commentsData = await getComments(topicData.comments);

            let commentsNumber = 0;

            for (const comment of commentsData) {
                commentsNumber += comment.answers.length + 1;
            }

            setTopicData({ topic: topicData, author: authorData, comments: commentsData, commentsNumber});
        };

        fetchData().catch((error) => toast.error(error.message));
    }, [userData]);

    return (
        <>
            <Toaster />

            {/*Signin popup*/}
            {isPopupVisible && (
                <AuthPopup />
            )}

            {/*Create username popup*/}
            {isUsernamePopupVisible && (
                <UsernamePopup />
            )}

            {topicData !== null ? (
                <div className={`p-5`}>
                    {/*topic*/}
                    <div className={`mb-4 flex flex-col gap-2`}>
                        <div className={`flex justify-between items-center`}>
                            <div className={`flex gap-2 items-center`}>
                                <div className={`w-6 h-6 bg-red-400 rounded-full`}>
                                    {/*FIXME: IMAGE*/}
                                </div>
                                {/*FIXME*/}
                                <Link href={`/profile/bgVKtsOrYzNhMTUiJtfuY0Myqkk2`}
                                className={`w-fit mb-2 flex items-center gap-2`}>
                                    <p className={`text-sm font-bold`}>
                                        {topicData.author.username} - <span className={`font-normal text-gray-500`}>
                                        {formatTime(topicData.topic.creationDate)}
                                        </span>
                                    </p>
                                </Link>
                            </div>

                            <div className={`p-2 relative rounded-full active:bg-gray-200 hover:bg-gray-100 cursor-pointer text-xl`}
                                 onClick={() => setShowReportOption(!showReportOption)}>
                                <FaEllipsis />

                                {showReportOption && (
                                    <div className={`absolute top-10 right-0 bg-white shadow-md border-[1px] border-black`}>
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

                                        {isMyTopic() && (
                                            // FIXME
                                            <div className={`px-5 py-3 flex items-center gap-2 hover:bg-gray-200 active:bg-gray-200`}
                                                 onClick={() => alert("DELETE")}>
                                                <TbTrash />
                                                <p className={`text-sm`}>
                                                    Delete
                                                </p>
                                            </div>
                                        )}

                                        <div className={`px-5 py-3 flex items-center gap-2 hover:bg-red-200 active:bg-red-200 text-red-500`}
                                             onClick={() => toast.success("We have received your report notification")}>
                                            <TbFlag />
                                            {/*FIXME*/}
                                            <p className={`text-sm`}>
                                                Report
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h2 className={`text-lg font-bold`}>
                            {topicData.topic.title}
                        </h2>

                        <TopicCategory text={topicData.topic.category} />

                        <p className={`text-sm`}>
                            {topicData.topic.body}
                        </p>
                    </div>

                    {/*Social engagement*/}
                    <div className={`mb-4 flex gap-5`}>
                        <Votes initCount={topicData.topic.upVoted.length - topicData.topic.downVoted.length}
                               id={topicData.topic.uid} collection={"topics"} />
                        <div className={`flex items-center gap-2 text-xs font-bold text-gray-400`}>
                            <TbMessageCircle2Filled />
                            <p>{topicData.commentsNumber} Comments</p>
                        </div>
                        <Share />
                    </div>

                    {/*Add Comment*/}
                    <div className={`my-4 flex flex-col items-end gap-2`}>
                        <p className={`text-xs`}>{COMMENT_MAX_LENGTH - commentText.length}</p>
                        <textarea className={`w-full p-2 resize-none overflow-y-auto ${commentTooLong ? "bg-red-200" : "bg-gray-100"}
                        rounded-lg border-[1px] border-gray-400 text-sm placeholder-gray-400`}
                                  rows={5} cols={50} placeholder={`What is your opinion ?`} value={commentText}
                        onChange={(event) => setNewComment(event.target.value)}>
                        </textarea>

                        <div className={`w-full flex justify-between items-center`}>
                            {/*Sorting*/}
                            {/*FIXME*/}
                            <div className={`flex items-center`}>
                                <p className={`text-sm`}>Sort by: </p>
                                <div className={`relative text-sm cursor-pointer`} onClick={() => setShowSortOptions(!showSortOptions)}>
                                    <div className={`px-3 py-1 ${showSortOptions && "bg-gray-200"} rounded-full hover:bg-gray-100 active:bg-gray-200 
                                        flex items-center gap-1`}>
                                        <p>Top</p>
                                        {showSortOptions ? (
                                            <LiaAngleUpSolid />
                                        ) : (
                                            <LiaAngleDownSolid />
                                        )}
                                    </div>

                                    <div className={`${!showSortOptions && " hidden"} min-w-max p-3 shadow-md bg-white absolute top-7 left-0 flex flex-col gap-3`}>
                                        <p>Hot</p>
                                        <p>Latest</p>
                                        <p>Oldest</p>
                                    </div>
                                </div>
                            </div>

                            <div className={`w-fit px-3 py-1 flex items-center gap-2 bg-orange-500 rounded-sm shadow-md 
                            active:shadow-sm text-white text-sm cursor-pointer`} onClick={() => postComment().catch((error) => console.log(error.message))}>
                                <p>Post comment</p>
                            </div>
                        </div>
                    </div>

                    {/*Comments*/}
                    <Divider />
                    {topicData.comments.map((comment, index) => (
                        <div key={index} className={`flex flex-col`}>
                            <CommentTile comment={comment} />

                            {comment.answers.map((nestedAnswer, nestedIndex) => (
                                <div key={`n${nestedIndex}`} className={`flex justify-start`}>
                                    <div className={`w-10 flex justify-center`}>
                                        <div className={`w-0.5 h-full bg-gray-300`}></div>
                                    </div>
                                    <div className={`flex-grow`}>
                                        <CommentTile comment={nestedAnswer} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`w-full h-full mt-10 flex flex-grow justify-center items-center`}>
                    Loading...
                </div>
            )}
        </>
    );
}
