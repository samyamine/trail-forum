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
import {collection, doc, DocumentData, DocumentReference, getDoc, getDocs, Timestamp} from "@firebase/firestore";
import toast from "react-hot-toast";
import {useAuth} from "@/app/authContext";
import {topicTypeColor} from "@/lib/consts";

interface IAnswer {
    answers: IAnswer[],
    author: string,
    body: string,
    creationDate: Date,
    isSecondLevel: boolean,
    votes: number,
}

interface ITopicData {
    id: string,
    content: DocumentData | undefined,
    user: DocumentData | undefined,
    answers: IAnswer[] | undefined,
}

const COMMENT_MAX_LENGTH = 500;

export default function TopicPage({ params }: { params: { id: string }}) {
    const {isPopupVisible, showPopup} = usePopup();
    const {userData} = useAuth();

    const [comment, setComment] = useState("");
    const [commentTooLong, setCommentTooLong] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showReportOption, setShowReportOption] = useState(false);
    const [topic, setTopic] = useState<ITopicData>({ answers: undefined, content: undefined, id: "", user: undefined });

    const setNewComment = (text: string) => {
        if (text.length <= COMMENT_MAX_LENGTH) {
            setComment(text);

            if (commentTooLong) {
                setCommentTooLong(false);
            }
        }
        else {
            setCommentTooLong(true);
        }
    };

    const getAuthor = async (uid: string): Promise<DocumentData | undefined> => {
        // FIXME: implement get topic author

        const userRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userRef);

        return userSnapshot.data();
    };

    const getTopicAnswers = async (topicId: string): Promise<IAnswer[]> => {
        // FIXME: implement
        // FIXME: get users for each comment and sub comment
        const answers: IAnswer[] = [];
        const queryAnswerSnapshot = await getDocs(collection(db, "topics", topicId, "answers"));

        for (const doc of queryAnswerSnapshot.docs) {
            const nestedAnswers = await getNestedAnswers(topicId, doc.id);
            const data = doc.data();

            const answer: IAnswer = {
                answers: nestedAnswers,
                author: data.author,
                body: data.body,
                creationDate: data.creationDate,
                isSecondLevel: data.isSecondLevel,
                votes: data.votes,
            };

            answers.push(answer);
        }

        return answers;
    };

    const getNestedAnswers = async (topicId: string, answerId: string): Promise<IAnswer[]> => {
        // FIXME: implement
        const answers: IAnswer[] = [];
        const queryNextAnswerSnapshot = await getDocs(collection(db, "topics", topicId, "answers", answerId, "answers"));

        for (const doc of queryNextAnswerSnapshot.docs) {
            const data = doc.data();

            const nestedAnswer: IAnswer = {
                answers: [],
                author: data.author,
                body: data.body,
                creationDate: data.creationDate,
                isSecondLevel: data.isSecondLevel,
                votes: data.votes,
            };

            answers.push(nestedAnswer);
        }

        return answers;
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
        const fetchAllTopicData = async () => {
            const topicRef = doc(db, "topics", params.id);
            const topicSnapshot = await getDoc(topicRef);

            if (topicSnapshot.exists()) {
                const user = await getAuthor(topicSnapshot.data().author);
                const answers = await getTopicAnswers(topicSnapshot.id)

                setTopic({ answers, content: topicSnapshot.data(), id: topicSnapshot.id, user });
            }
        };

        fetchAllTopicData().catch((error) => toast.error(error.message));
    }, []);

    return (
        <>
            {/*Signin popup*/}
            {isPopupVisible && (
                <AuthPopup />
            )}

            {typeof topic.content !== "undefined" && typeof topic.user !== "undefined" && typeof topic.answers !== "undefined" ? (
                <div className={`p-5`}>
                    {/*topic*/}
                    <div className={`mb-4 flex flex-col gap-2`}>
                        <div className={`flex justify-between items-center`}>
                            <div className={`flex gap-2 items-center`}>
                                <div className={`w-6 h-6 bg-red-400 rounded-full`}>
                                    {/*IMAGE*/}
                                </div>
                                <p className={`text-sm font-bold`}>
                                    {topic.user.username} - <span className={`font-normal text-gray-500`}>1h ago</span>
                                </p>
                            </div>

                            <div className={`p-2 relative rounded-full active:bg-gray-200 hover:bg-gray-100 cursor-pointer text-xl`}
                                 onClick={() => setShowReportOption(!showReportOption)}>
                                <FaEllipsis />

                                <div className={`${!showReportOption && "hidden"} px-5 py-3 absolute top-10 right-0 bg-white shadow-md
                                flex items-center gap-2 border-[1px] border-black hover:bg-gray-200 active:bg-gray-200`}>
                                    <TbFlag />
                                    <p className={`text-sm`}>
                                        Report
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h2 className={`text-lg font-bold`}>
                            {topic.content.title}
                        </h2>

                        <TopicCategory text={topic.content.category} />

                        <p className={`text-sm`}>
                            {topic.content.body}
                        </p>
                    </div>

                    {/*Social engagement*/}
                    <div className={`mb-4 flex gap-5`}>
                        <Votes count={topic.content.votes}
                               id={topic.id} />
                        <div className={`flex items-center gap-2 text-xs font-bold text-gray-400`}>
                            <TbMessageCircle2Filled />
                            <p>{topic.content.comments} Comments</p>
                        </div>
                        <Share />
                    </div>

                    {/*Add Comment*/}
                    <div className={`my-4 flex flex-col items-end gap-2`}>
                        <p className={`text-xs`}>{COMMENT_MAX_LENGTH - comment.length}</p>
                        <textarea className={`w-full p-2 resize-none overflow-y-auto ${commentTooLong ? "bg-red-200" : "bg-gray-100"}
                        rounded-lg border-[1px] border-gray-400 text-sm placeholder-gray-400`}
                                  rows={5} cols={50} placeholder={`What is your opinion ?`} value={comment}
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
                            active:shadow-sm text-white text-sm cursor-pointer`}>
                                <p>Post comment</p>
                            </div>
                        </div>
                    </div>

                    {/*Comments*/}
                    <Divider />
                    {topic.answers.map((answer, index) => (
                        <div key={index} className={`flex flex-col`}>
                            <CommentTile />

                            {answer.answers.map((nestedAnswer, index) => (
                                <div key={`n${index}`} className={`flex justify-between`}>
                                    <div className={`w-10 flex justify-center`}>
                                        <div className={`w-0.5 h-full bg-gray-300`}></div>
                                    </div>
                                    <div className={`w-fit flex flex-col`}>
                                        <CommentTile />
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
