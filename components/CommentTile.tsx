"use client";

import Votes from "@/components/Votes";
import Share from "@/components/Share";
import {TbFlag, TbMessageCircle} from "react-icons/tb";
import {SlOptions} from "react-icons/sl";
import {useEffect, useState} from "react";
import {IComment} from "@/lib/interfaces";
import {DocumentReference, getDoc, Timestamp} from "@firebase/firestore";
import toast from "react-hot-toast";

const REPLY_MAX_LENGTH = 500;

export default function CommentTile({ comment }: { comment: IComment | DocumentReference }) {
    const [showReportOption, setReportOption] = useState(false);
    const [commentData, setCommentData] = useState<IComment | null>(null);

    useEffect(() => {
        const getData = async () => {
            if (comment instanceof DocumentReference) {
                const commentSnapshot = await getDoc(comment);

                if (!commentSnapshot.exists() || typeof commentSnapshot.data() === "undefined") {
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
        <div className={`w-full py-3 text-gray-900`}>
            <div className={`flex justify-between items-center`}>
                <div className={`mb-2 flex items-center gap-2`}>
                    <div className={`w-6 h-6 bg-red-400 rounded-full`}></div>
                    <p className={`font-bold text-sm`}>
                        user - <span className={`font-normal text-gray-500`}>1h ago</span>
                    </p>
                </div>

                <div className={`${showReportOption && "bg-gray-200"} w-fit h-fit p-1 rounded-full relative hover:bg-gray-200 
                cursor-pointer`} onClick={() => setReportOption(!showReportOption)}>
                    <SlOptions />

                    <div className={`${!showReportOption && "hidden"} px-5 py-3 absolute top-7 right-0 bg-white shadow-md
                    flex items-center gap-2 border-[1px] border-black hover:bg-gray-200 active:bg-gray-200`}>
                        <TbFlag />
                        <p className={`text-sm`}>
                            Report
                        </p>
                    </div>
                </div>
            </div>
            <h1 className={`mb-4 pl-5 pr-3 text-sm`}>
                {commentData.body}
            </h1>

            <div className={`pl-5 pr-3 flex gap-5`}>
                <Votes id={commentData.uid} collection={`comments`} initCount={commentData.upVoted.length - commentData.downVoted.length} />
                <div className={`px-2 rounded-full cursor-pointer flex gap-1 items-center border-[1px] border-black hover:bg-gray-300 text-xs`}
                onClick={() => alert("REPLY")}>
                    <div>
                        <TbMessageCircle />
                    </div>
                    <p className={`p-1`}>Reply</p>
                </div>
                <Share />
            </div>
        </div>
    );
}