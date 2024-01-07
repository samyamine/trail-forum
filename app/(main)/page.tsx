"use client";

import TopicTile from "@/components/TopicTile";
import Divider from "@/components/Divider";
import { FaPlus } from "react-icons/fa6";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import React, {useState} from "react";
import {usePopup} from "@/app/context";
import SignInPopup from "@/components/SignInPopup";
import Link from "next/link";

export default function HomePage() {
    const { isPopupVisible } = usePopup();

    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);

    const toggleCategorySelector = (): void => {
        if (!showSortOptions && showCategoryOptions) {
            setShowCategoryOptions(false);
            setShowSortOptions(true);
        }
        else {
            setShowSortOptions(!showSortOptions);
        }
    };

    const toggleLocationSelector = (): void => {
        if (!showCategoryOptions && showSortOptions) {
            setShowSortOptions(false);
            setShowCategoryOptions(true);
        }
        else {
            setShowCategoryOptions(!showCategoryOptions);
        }
    };

    return (
        <>
            {/*Signin popup*/}
            {isPopupVisible && (
                <SignInPopup />
            )}

            <div className={`w-full overflow-y-auto`}>
                <div className={`md:w-1/2 w-full px-5 py-3`}>
                    {/*New topic bar*/}
                    <div className={`w-full flex justify-between md:justify-start md:gap-5 items-center`}>
                        <Link href={`/topic/new`}>
                            <div className={`w-fit px-3 py-1 flex items-center gap-2 bg-orange-500 rounded-sm shadow-md 
                            active:shadow-sm text-white text-sm cursor-pointer`}>
                                <FaPlus />
                                <p>New Topic</p>
                            </div>
                        </Link>

                        {/*Sort Options*/}
                        <div className={`flex gap-3 text-xs`}>
                            <div className={`relative flex items-center gap-1 cursor-pointer`} onClick={toggleCategorySelector}>
                                <div className={`px-3 py-1 ${showSortOptions && "bg-gray-200"} rounded-full 
                                hover:bg-gray-100 active:bg-gray-200 flex items-center gap-1`}>
                                    <p>Hot</p>
                                    {showSortOptions ? (
                                        <LiaAngleUpSolid />
                                    ) : (
                                        <LiaAngleDownSolid />
                                    )}
                                </div>

                                <div className={`${!showSortOptions && " hidden"} min-w-max p-3 shadow-md bg-white 
                                absolute top-7 left-0 flex flex-col gap-3 border-[1px] border-black`}>
                                    <p>Hot</p>
                                    <p>Latest</p>
                                    <p>News</p>
                                    <p>Others</p>
                                </div>
                            </div>

                            {/*Categories*/}
                            <div className={`cursor-pointer relative`} onClick={toggleLocationSelector}>
                                <div className={`px-3 py-1 ${showCategoryOptions && "bg-gray-200"} rounded-full 
                                hover:bg-gray-100 active:bg-gray-200 flex items-center gap-1`}>
                                    <p>News</p>
                                    {showCategoryOptions ? (
                                        <LiaAngleUpSolid />
                                    ) : (
                                        <LiaAngleDownSolid />
                                    )}
                                </div>

                                <div className={`${!showCategoryOptions && " hidden"} min-w-max p-3 shadow-md bg-white 
                                absolute top-7 left-0 flex flex-col gap-3 border-[1px] border-black`}>
                                    <p>News</p>
                                    <p>Discussion</p>
                                    <p>Training</p>
                                    <p>Races</p>
                                    <p>Gear</p>
                                    <p>Live</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />
                <div className={`flex`}>
                    {/*Categories feed*/}
                    <div className={`max-md:hidden w-1/4 border-r-[1px] border-black`}>
                        HEY
                    </div>

                    {/*Main topics feed*/}
                    <div className={`w-full  md:w-3/4 lg:mx-10 flex flex-col items-center`}>
                        <TopicTile />
                        <Divider />
                        <TopicTile />
                        <Divider />
                        <TopicTile />
                        <Divider />
                        <TopicTile />
                        <Divider />
                        <TopicTile />
                        <Divider />
                        <TopicTile />
                        <Divider />
                    </div>
                </div>
            </div>

            {/*Last News*/}
        </>
    )
}
