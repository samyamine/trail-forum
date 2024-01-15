"use client";

import {FaEllipsis} from "react-icons/fa6";
import Votes from "@/components/Votes";
import Share from "@/components/Share";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import React, {useEffect, useState} from "react";
import Divider from "@/components/Divider";
import CommentTile from "@/components/CommentTile";
import {TbFlag, TbMessageCircle2Filled} from "react-icons/tb";
import TopicCategory from "@/components/TopicCategory";
import {usePopup} from "@/app/popupContext";
import AuthPopup from "@/components/AuthPopup";
import {db} from "@/lib/firebase/config";
import {
    addDoc, arrayUnion, collection,
    doc,
    DocumentData, DocumentReference,
    getDoc, setDoc, Timestamp, updateDoc,
} from "@firebase/firestore";
import toast from "react-hot-toast";
import {useAuth} from "@/app/authContext";
import {IComment, ITopic, IUser} from "@/lib/interfaces";
import {getAuthor, getCommentAnswers, getTopic, getTopicComments} from "@/lib/topic/utils";
import {isUndefined} from "@/lib/utils";

const COMMENT_MAX_LENGTH = 500;

interface IData {
    topic: ITopic,
    author: IUser,
    comments: IComment[],
    commentsNumber: number,
}

export default function TopicPage({ params }: { params: { id: string }}) {
    const {isPopupVisible, showPopup} = usePopup();
    const {userData} = useAuth();

    const [commentText, setCommentText] = useState("");
    const [commentTooLong, setCommentTooLong] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showReportOption, setShowReportOption] = useState(false);
    const [data, setData] = useState<IData | null>(null);

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

    const postComment = async () => {
        // FIXME
        if (isUndefined(userData)) {
            showPopup();
        }
        else if (commentText.length === 0) {
            throw new Error("Comment is too long");
        }
        else {
            const myUserData = userData as IUser;
            const topicRef = doc(db, "topics", params.id);

            const commentRef = await addDoc(collection(db, "comments"), {
                answers: [],
                author: doc(db, "users", myUserData.uid),
                body: commentText,
                creationDate: Date.now(),
                topicRef,
                upVoted: [],
                downVoted: [],
            });

            // FIXME: Add to topic comments
            await updateDoc(topicRef, {
                comments: arrayUnion(commentRef),
            });

            // FIXME: Add to user comments

            // FIXME: Reload page
            console.log("YO");
            window.location.reload();
            console.log("YA")
        }
    };

    const sentUpVote = async () => {
        // FIXME
        if (typeof userData === "undefined") {
            showPopup();
        }

        // Check if
    };

    const sendDownVote = async () => {
        // FIXME
    };

    useEffect(() => {
        const fetchData = async () => {
            const topicData = await getTopic(params.id);
            const authorData = await getAuthor(topicData.author);
            const commentsData = await getTopicComments(topicData.comments);

            let commentsNumber = 0;

            for (const comment of commentsData) {
                commentsNumber += comment.answers.length + 1;
            }

            setData({ topic: topicData, author: authorData, comments: commentsData, commentsNumber});
        };

        fetchData().catch((error) => toast.error(error.message));
    }, []);

    return (
        <>
            {/*Signin popup*/}
            {isPopupVisible && (
                <AuthPopup />
            )}

            {data !== null ? (
                <div className={`p-5`}>
                    {/*topic*/}
                    <div className={`mb-4 flex flex-col gap-2`}>
                        <div className={`flex justify-between items-center`}>
                            <div className={`flex gap-2 items-center`}>
                                <div className={`w-6 h-6 bg-red-400 rounded-full`}>
                                    {/*IMAGE*/}
                                </div>
                                <p className={`text-sm font-bold`}>
                                    {data.author.username} - <span className={`font-normal text-gray-500`}>1h ago</span>
                                </p>
                            </div>

                            <div className={`p-2 relative rounded-full active:bg-gray-200 hover:bg-gray-100 cursor-pointer text-xl`}
                                 onClick={() => setShowReportOption(!showReportOption)}>
                                <FaEllipsis />

                                <div className={`${!showReportOption && "hidden"} px-5 py-3 absolute top-10 right-0 bg-white shadow-md
                                flex items-center gap-2 border-[1px] border-black hover:bg-gray-200 active:bg-gray-200`}
                                onClick={() => toast.success("We have received your report notification")}>
                                    <TbFlag />
                                    {/*FIXME*/}
                                    <p className={`text-sm`}>
                                        Report
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className={`text-lg font-bold`}>
                            {data.topic.title}
                        </h2>

                        <TopicCategory text={data.topic.category} />

                        <p className={`text-sm`}>
                            {data.topic.body}
                        </p>
                    </div>

                    {/*Social engagement*/}
                    <div className={`mb-4 flex gap-5`}>
                        <Votes initCount={data.topic.upVoted.length - data.topic.downVoted.length}
                               id={data.topic.uid} collection={"topics"} />
                        <div className={`flex items-center gap-2 text-xs font-bold text-gray-400`}>
                            <TbMessageCircle2Filled />
                            <p>{data.commentsNumber} Comments</p>
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
                    {data.comments.map((comment, index) => (
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
                <div className={`w-full h-full flex flex-grow justify-center items-center`}>
                    Loading...
                </div>
            )}
        </>
    );
}
