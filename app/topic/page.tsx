"use client";

import {FaComment, FaEllipsis, FaPlus} from "react-icons/fa6";
import Votes from "@/components/Votes";
import Comments from "@/components/Comments";
import Share from "@/components/Share";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import React, {useState} from "react";
import Divider from "@/components/Divider";
import CommentTile from "@/components/CommentTile";
import {TbMessageCircle, TbMessageCircle2Filled} from "react-icons/tb";

export default function TopicPage() {
    const [showSortOptions, setShowSortOptions] = useState(false);

    return (
        <div className={`px-5 py-5`}>
            {/*topic*/}
            <div className={`mb-4 flex flex-col gap-2`}>
                <div className={`flex justify-between items-center`}>
                    <div className={`flex gap-2 items-center`}>
                        <div className={`w-6 h-6 bg-red-400 rounded-full`}>
                            {/*IMAGE*/}
                        </div>
                        <p className={`text-sm`}>
                            user - <span>1h ago</span>
                        </p>
                    </div>

                    <div className={`p-2 rounded-full active:bg-gray-200 hover:bg-gray-100 cursor-pointer text-xl`}>
                        <FaEllipsis />
                    </div>
                </div>

                <h2 className={`text-lg font-bold`}>
                    Reducere potius haec Maximini Gordianorum suadendo truculenti
                    multa veritatis in in deberet trudebat fortunas imperatoris
                </h2>

                <div className={`w-fit px-2 bg-blue-400 rounded-full text-xs text-white`}>
                    Discussion
                </div>

                <p className={`text-sm`}>
                    Reducere potius haec Maximini Gordianorum suadendo truculenti
                    multa veritatis in in deberet trudebat fortunas imperatoris
                    lenitate truculenti truculenti veritatis exitium scrutanda
                    Maximini in autem propositum viam ad scrutanda viam quae reducere
                    eum exitium similia imperatoris obstinatum ut factitasse Maximini
                    et veritatis Gordianorum illius ut exitium humanitatisque similia
                    exitium ut potius.
                </p>
            </div>

            {/*Social engagement*/}
            <div className={`mb-4 flex gap-5`}>
                <Votes />
                <div className={`flex items-center gap-2 text-xs font-bold text-gray-400`}>
                    <TbMessageCircle2Filled />
                    <p>2 645 Comments</p>
                </div>
                <Share />
            </div>

            {/*Add Comment*/}
            <div className={`my-4 flex flex-col items-end gap-2`}>
                <p className={`text-xs`}>500</p>
                <textarea className={`w-full p-2 resize-none overflow-y-auto bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`}
                          rows={5} cols={50} placeholder={`What is your opinion ?`}>
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
            <div className={`flex flex-col`}>
                <CommentTile />

                <div className={`flex justify-between`}>
                    <div className={`w-10 flex justify-center`}>
                        <div className={`w-0.5 h-full bg-gray-300`}></div>
                    </div>
                    <div className={`w-fit flex flex-col`}>
                        <CommentTile />
                    </div>
                </div>

                <div className={`flex justify-between`}>
                    <div className={`w-10 flex justify-center`}>
                        <div className={`w-0.5 h-full bg-gray-300`}></div>
                    </div>
                    <div className={`w-fit flex flex-col`}>
                        <CommentTile />
                    </div>
                </div>

                <CommentTile />
            </div>
        </div>
    );
}