"use client";

import Votes from "@/components/Votes";
import Comments from "@/components/Comments";
import Share from "@/components/Share";
import {FaComment} from "react-icons/fa6";
import {TbFlag, TbMessageCircle} from "react-icons/tb";
import {SlOptions} from "react-icons/sl";
import {useState} from "react";

export default function CommentTile() {
    const [showReportOption, setReportOption] = useState(false);

    return (
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
                Because most users do not agree with the assessment that Ubuntu is
                flawed. Don't mistake how loudly an opinion is disseminated with how
                widely it is held. There's a lot of institutional and commercial
                users that don't care about systemd or snap or whatever, they just
                want a dependable system with guaranteed support.
            </h1>

            <div className={`pl-5 pr-3 flex gap-5`}>
                <Votes count={0} />
                <div className={`px-2 rounded-full cursor-pointer flex gap-1 items-center border-[1px] border-black hover:bg-gray-300 text-xs`}>
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