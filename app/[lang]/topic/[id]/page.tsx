"use client";

import {FaEllipsis} from "react-icons/fa6";
import Votes from "@/components/Votes";
import Share from "@/components/Share";
import React, {useEffect, useRef, useState} from "react";
import Divider from "@/components/Divider";
import CommentTile from "@/components/CommentTile";
import {TbBookmark, TbBookmarkFilled, TbFlag, TbMessageCircle2Filled} from "react-icons/tb";
import TopicCategory from "@/components/TopicCategory";
import {usePopup} from "@/app/[lang]/popupContext";
import AuthPopup from "@/components/AuthPopup";
import {db} from "@/lib/firebase/config";
import {
    addDoc, arrayRemove, arrayUnion, collection,
    doc,
    serverTimestamp,
    updateDoc,
} from "@firebase/firestore";
import toast, {Toaster} from "react-hot-toast";
import {useAuth} from "@/app/[lang]/authContext";
import {IComment, ITopic, IUser} from "@/lib/interfaces";
import {getAuthor, getTopic, getComments, formatTime} from "@/lib/topic/utils";
import {isUndefined} from "@/lib/utils";
import InitAccountPopup from "@/components/InitAccountPopup";
import Link from "next/link";
import {getDictionary} from "@/lib/dictionary";
import SharePopup from "@/components/SharePopup";

const COMMENT_MAX_LENGTH = 500;

interface IData {
    topic: ITopic,
    author: IUser,
    comments: IComment[],
    commentsNumber: number,
}

export default function TopicPage({ params }: { params: { id: string, lang: string }}) {
    const {isAuthPopupVisible, isInitAccountPopupVisible, isSharePopupVisible, showAuthPopup, showSharePopup} = usePopup();
    const {userData} = useAuth();

    const sortRef = useRef<HTMLDivElement>(null);
    const topicOptionsRef = useRef<HTMLDivElement>(null);

    const [dictionary, setDictionary] = useState<any>();
    const [commentText, setCommentText] = useState("");
    const [commentTooLong, setCommentTooLong] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showTopicOption, setShowTopicOption] = useState(false);
    const [topicData, setTopicData] = useState<IData | null>(null);

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
            showAuthPopup();
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
            showAuthPopup();
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

        const handleClickOutsideSort = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setShowSortOptions(false);
            }
        };

        const handleClickOutsideTopic = (event: MouseEvent) => {
            if (topicOptionsRef.current && !topicOptionsRef.current.contains(event.target as Node)) {
                setShowTopicOption(false);
            }
        };

        if (params.lang !== "fr" && params.lang !== "en") {
            throw new Error(`Language ${params.lang} is not supported`);
        }

        getDictionary(params.lang).then((dict) => {
            setDictionary(dict);
        });

        window.addEventListener('click', handleClickOutsideSort);
        window.addEventListener('click', handleClickOutsideTopic);

        fetchData().catch((error) => toast.error(error.message));

        return () => {
            window.removeEventListener('click', handleClickOutsideSort);
            window.removeEventListener('click', handleClickOutsideTopic);
        };
    }, []);

    return (
        <div className={`w-full flex flex-col items-center`}>

            <Toaster toastOptions={{ duration: 3000 }} />

            {/*Signin popup*/}
            {isAuthPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {/*Create username popup*/}
            {isInitAccountPopupVisible && (
                <InitAccountPopup dictionary={dictionary} />
            )}

            {isSharePopupVisible && (
                <SharePopup dictionary={dictionary} />
            )}

            {topicData !== null ? (
                <div className={`w-full md:w-2/3 lg:w-1/2 p-5`}>
                    {/*topic*/}
                    <div className={`mb-4 flex flex-col gap-2`}>
                        <div className={`flex justify-between items-center`}>
                            <div className={`flex gap-2 items-center`}>
                                <div className={`w-6 h-6 bg-red-400 rounded-full`}>
                                    {/*FIXME: IMAGE*/}
                                </div>
                                {/*FIXME*/}
                                <Link href={`/profile/${topicData.author.uid}`}
                                className={`w-fit flex items-center gap-2`}>
                                    <p className={`text-sm font-bold`}>
                                        {topicData.author.username} - <span className={`font-normal text-gray-500`}>
                                        {formatTime(topicData.topic.creationDate, dictionary)}
                                        </span>
                                    </p>
                                </Link>
                            </div>

                            <div ref={topicOptionsRef} className={`p-2 relative rounded-full active:bg-gray-200 hover:bg-gray-100 cursor-pointer text-xl`}
                                 onClick={() => setShowTopicOption(!showTopicOption)}>
                                <FaEllipsis />

                                <div className={`${!showTopicOption && "hidden"} absolute top-10 right-0 bg-white shadow-md border-[1px] border-black`}>
                                    <div className={`px-5 py-3 hover:bg-gray-200 active:bg-gray-200`}
                                    onClick={() => toggleSave().catch((error) => console.log(error.message))}>
                                        <div className={`${!isSaved() && "hidden"} flex items-center gap-2`}>
                                            <TbBookmarkFilled />
                                            <p className={`text-sm`}>
                                                {dictionary.topic.remove}
                                            </p>
                                        </div>

                                        <div className={`${isSaved() && "hidden"} flex items-center gap-2`}>
                                            <TbBookmark />
                                            <p className={`text-sm`}>
                                                {dictionary.topic.save}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`${isMyTopic() && "hidden"} px-5 py-3 flex items-center gap-2 hover:bg-red-200 active:bg-red-200 text-red-500`}
                                         onClick={() => toast.success("We have received your report notification")}>
                                        <TbFlag />
                                        {/*FIXME*/}
                                        <p className={`text-sm`}>
                                            {dictionary.topic.report}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2 className={`text-lg font-bold`}>
                            {topicData.topic.title}
                        </h2>

                        <TopicCategory text={topicData.topic.category} dictionary={dictionary} />

                        <p className={`text-sm`}>
                            {topicData.topic.body}
                        </p>
                    </div>

                    {/*Social engagement*/}
                    <div className={`mb-4 flex gap-5`}>
                        <Votes initUpVotes={topicData.topic.upVoted.length} initDownVotes={topicData.topic.downVoted.length}
                            id={topicData.topic.uid} collection={"topics"} />
                        <div className={`flex items-center gap-2 text-xs font-bold text-gray-400`}>
                            <TbMessageCircle2Filled />
                            <p>
                                {topicData.commentsNumber} {dictionary.topic.comments}
                            </p>
                        </div>
                        <Share dictionary={dictionary} onClickCallback={() => showSharePopup(params.id)} />
                    </div>

                    {/*Add Comment*/}
                    <div className={`my-4 flex flex-col items-end gap-2`}>
                        <p className={`text-xs`}>{COMMENT_MAX_LENGTH - commentText.length}</p>
                        <textarea className={`w-full p-2 resize-none overflow-y-auto ${commentTooLong ? "bg-red-200" : "bg-gray-100"}
                        rounded-lg border-[1px] border-gray-400 text-sm placeholder-gray-400`}
                                  rows={5} cols={50} placeholder={dictionary.topic.opinion} value={commentText}
                        onChange={(event) => setNewComment(event.target.value)}>
                        </textarea>

                        <div className={`w-full flex justify-end items-center`}>
                            {/*Sorting*/}
                            {/*FIXME*/}
                            {/*<div ref={sortRef} className={`flex items-center`}>*/}
                            {/*    <p className={`text-sm`}>Sort by: </p>*/}
                            {/*    <div className={`relative text-sm cursor-pointer`} onClick={() => setShowSortOptions(!showSortOptions)}>*/}
                            {/*        <div className={`px-3 py-1 ${showSortOptions && "bg-gray-200"} rounded-full hover:bg-gray-100 active:bg-gray-200 */}
                            {/*            flex items-center gap-1`}>*/}
                            {/*            <p>Top</p>*/}

                            {/*            <div className={`${!showSortOptions && "hidden"}`}>*/}
                            {/*                <LiaAngleUpSolid />*/}
                            {/*            </div>*/}

                            {/*            <div className={`${showSortOptions && "hidden"}`}>*/}
                            {/*                <LiaAngleDownSolid />*/}
                            {/*            </div>*/}
                            {/*        </div>*/}

                            {/*        <div className={`${!showSortOptions && " hidden"} min-w-max p-3 shadow-md bg-white absolute top-7 left-0 flex flex-col gap-3`}>*/}
                            {/*            <p>Hot</p>*/}
                            {/*            <p>Latest</p>*/}
                            {/*            <p>Oldest</p>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            <div className={`w-fit px-3 py-1 flex items-center gap-2 bg-orange-500 rounded-sm shadow-md 
                            active:shadow-sm text-white text-sm cursor-pointer`} onClick={() => postComment().catch((error) => console.log(error.message))}>
                                <p>{dictionary.topic.reply}</p>
                            </div>
                        </div>
                    </div>

                    {/*Comments*/}
                    <Divider />
                    {topicData.comments.map((comment, index) => (
                        <div key={index} className={`flex flex-col`}>
                            <CommentTile comment={comment} dictionary={dictionary} />

                            {comment.answers.map((nestedAnswer, nestedIndex) => (
                                <div key={`n${nestedIndex}`} className={`flex justify-start`}>
                                    <div className={`w-10 flex justify-center`}>
                                        <div className={`w-0.5 h-full bg-gray-300`}></div>
                                    </div>
                                    <div className={`flex-grow`}>
                                        <CommentTile comment={nestedAnswer} dictionary={dictionary} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`w-full h-full mt-10 flex flex-grow justify-center items-center`}>
                    {/*FIXME*/}
                    Loading...
                </div>
            )}
        </div>
    );
}
