"use client";

import {TbArrowBigDown, TbArrowBigUp} from "react-icons/tb";
import {useAuth} from "@/app/authContext";
import {useState} from "react";
import {isUndefined} from "@/lib/utils";

export default function Votes({ count, id }: { count: number, id: string, onUpVote: () => void, onDownVote: () => void }) {
    const {userData} = useAuth();

    const onUpVote = async () => {

    };

    const onDownVote = async () => {

    };

    const [upVoteActive, setUpVote] = useState(!isUndefined(userData) && (userData?.upVotedComments.includes(id) || userData?.upVotedTopics.includes(id)));
    const [downVoteActive, setDownVote] = useState(!isUndefined(userData) && (userData?.downVotedComments.includes(id) || userData?.downVotedTopics.includes(id)));

    return (
        <div className={`rounded-full flex gap-2 items-center border-[1px] border-black text-xs`}>
            <div className={`p-1 rounded-full cursor-pointer hover:bg-gray-300 ${upVoteActive && "bg-gray-300 text-blue-500"}`}
            onClick={onUpVote}>
                <TbArrowBigUp />
            </div>
            <p>{count}</p>

            <div className={`p-1 rounded-full cursor-pointer hover:bg-gray-300 ${downVoteActive && "bg-gray-300 text-red-500"}`}
            onClick={onDownVote}>
                <TbArrowBigDown />
            </div>
        </div>
    );
}