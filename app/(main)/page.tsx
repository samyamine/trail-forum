"use client";

import TopicTile from "@/components/TopicTile";
import Divider from "@/components/Divider";
import { FaPlus } from "react-icons/fa6";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import React, {useEffect, useRef, useState} from "react";
import {usePopup} from "@/app/popupContext";
import Link from "next/link";
import AuthPopup from "@/components/AuthPopup";
import ProfilePicture from "@/components/ProfilePicture";
import IconTextButton from "@/components/IconTextButton";
import {doc, DocumentData, getDoc} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {getAuthor, getTopic, getComments} from "@/lib/topic/utils";
import toast, {Toaster} from "react-hot-toast";
import {ITopic} from "@/lib/interfaces";
import UsernamePopup from "@/components/UsernamePopup";
import {useAuth} from "@/app/authContext";

export default function HomePage() {
    const { isPopupVisible, hidePopup, isUsernamePopupVisible } = usePopup();

    const trendsRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);

    const [showTrendOptions, setShowTrendOptions] = useState(false);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [topic, setTopic] = useState<ITopic | null>(null);

    useEffect(() => {
        const handleClickOutsideTrend = (event: MouseEvent) => {
            if (trendsRef.current && !trendsRef.current.contains(event.target as Node)) {
                setShowTrendOptions(false);
            }
        };

        const handleClickOutsideCategory = (event: MouseEvent) => {
            if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
                setShowCategoryOptions(false);
            }
        };

        window.addEventListener('click', handleClickOutsideTrend);
        window.addEventListener('click', handleClickOutsideCategory);

        // FIXME: Generic to make a real feed
        getTopic("JeikBzLEROcPWF5pIA7N")
            .then((topicData) => setTopic(topicData))
            .catch((error) => toast.error(error.message));

        return () => {
            window.removeEventListener('click', handleClickOutsideTrend);
            window.removeEventListener('click', handleClickOutsideCategory);
        };
    }, []);

    return topic !== null ? (
        <>
            {/*Signin popup*/}
            {isPopupVisible && (
                <AuthPopup />
            )}

            {isUsernamePopupVisible && (
                <UsernamePopup />
            )}

            <div className={`w-full overflow-y-auto`}>
                <div className={`md:w-1/2 w-full px-5 py-3`}>
                    {/*New topic bar*/}
                    <div className={`w-full flex justify-between md:justify-start md:gap-5 items-center`}>
                        <Link href={`/topic/new`}>
                            <IconTextButton text={"New Topic"} />
                        </Link>

                        {/*Sort Options*/}
                        <div className={`flex gap-3 text-xs`}>
                            {/*Trends*/}
                            <div ref={trendsRef} className={`relative flex items-center gap-1 cursor-pointer`}
                                onClick={() => setShowTrendOptions(!showTrendOptions)}>
                                <div className={`px-3 py-1 ${showTrendOptions && "bg-gray-200"} rounded-full 
                                hover:bg-gray-100 active:bg-gray-200 flex items-center gap-1`}>
                                    <p>Hot</p>

                                    <div className={`${!showTrendOptions && "hidden"}`}>
                                        <LiaAngleUpSolid />
                                    </div>

                                    <div className={`${showTrendOptions && "hidden"}`}>
                                        <LiaAngleDownSolid />
                                    </div>
                                </div>

                                <div className={`${!showTrendOptions && " hidden"} min-w-max p-3 shadow-md bg-white 
                                absolute top-7 left-0 flex flex-col gap-3 border-[1px] border-black`}>
                                    <p>Hot</p>
                                    <p>Latest</p>
                                    <p>News</p>
                                    <p>Following</p>
                                    <p>Others</p>
                                </div>
                            </div>

                            {/*Categories*/}
                            <div ref={categoriesRef} className={`cursor-pointer relative`}
                            onClick={() => setShowCategoryOptions(!showCategoryOptions)}>
                                <div className={`px-3 py-1 ${showCategoryOptions && "bg-gray-200"} rounded-full 
                                hover:bg-gray-100 active:bg-gray-200 flex items-center gap-1`}>
                                    <p>News</p>

                                    <div className={`${!showCategoryOptions && "hidden"}`}>
                                        <LiaAngleUpSolid />
                                    </div>

                                    <div className={`${showCategoryOptions && "hidden"}`}>
                                        <LiaAngleDownSolid />
                                    </div>
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
                    <div className={`w-full md:w-3/4 lg:mx-10 flex flex-col items-center`}>
                        <TopicTile topic={topic} />
                        <Divider />
                        <TopicTile topic={topic} />
                        <Divider />
                        <TopicTile topic={topic} />
                        <Divider />
                        <TopicTile topic={topic} />
                        <Divider />
                        <TopicTile topic={topic} />
                        <Divider />
                        <TopicTile topic={topic} />
                        <Divider />
                    </div>
                </div>
            </div>

            {/*Last News*/}
        </>
    ) : (
        <div className={`mt-3`}>
            Loading...
        </div>
    );
}
