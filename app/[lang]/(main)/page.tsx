"use client";

import TopicTile from "@/components/TopicTile";
import Divider from "@/components/Divider";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import AuthPopup from "@/components/AuthPopup";
import IconTextButton from "@/components/IconTextButton";
import {getTopic} from "@/lib/topic/utils";
import toast from "react-hot-toast";
import {ITopic} from "@/lib/interfaces";
import UsernamePopup from "@/components/UsernamePopup";
import {ECategoryType, ETrendType} from "@/lib/enums";
import {usePopup} from "@/app/[lang]/popupContext";
import {getDictionary} from "@/lib/dictionary";
import {isUndefined} from "@/lib/utils";

export default function HomePage({ params }: {params: { lang: string }}) {
    const { isPopupVisible, hidePopup, isUsernamePopupVisible } = usePopup();

    const trendsRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);

    const [dictionary, setDictionary] = useState<any>();
    const [showTrendOptions, setShowTrendOptions] = useState(false);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [topic, setTopic] = useState<ITopic | null>(null);
    const [selectedTrend, setSelectedTrend] = useState<string>(ETrendType.Hot);
    const [selectedCategory, setSelectedCategory] = useState<string>(ECategoryType.News);

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

        if (params.lang !== "fr" && params.lang !== "en") {
            throw new Error(`Language ${params.lang} is not supported`);
        }

        getDictionary(params.lang).then((dict) => {
            setDictionary(dict);
        });

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

    return topic !== null && !isUndefined(dictionary) ? (
        <>
            {/*Signin popup*/}
            {isPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {isUsernamePopupVisible && (
                <UsernamePopup dictionary={dictionary} />
            )}

            <div className={`w-full overflow-y-auto`}>
                <div className={`md:w-2/3 lg:w-1/2 w-full px-5 py-3`}>
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
                                    <p>
                                        {selectedTrend}
                                    </p>

                                    <div className={`${!showTrendOptions && "hidden"}`}>
                                        <LiaAngleUpSolid />
                                    </div>

                                    <div className={`${showTrendOptions && "hidden"}`}>
                                        <LiaAngleDownSolid />
                                    </div>
                                </div>

                                <div className={`${!showTrendOptions && " hidden"} min-w-max shadow-md bg-white 
                                absolute top-7 left-0 border-[1px] border-black`}>
                                    {Object.keys(ETrendType).map((type, index) => (
                                        <p key={index} className={`px-3 py-2 hover:bg-gray-200 active:bg-gray-100`}
                                        onClick={() => setSelectedTrend(type)}>
                                            {type}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/*Categories*/}
                            <div ref={categoriesRef} className={`cursor-pointer relative`}
                            onClick={() => setShowCategoryOptions(!showCategoryOptions)}>
                                <div className={`px-3 py-1 ${showCategoryOptions && "bg-gray-200"} rounded-full 
                                hover:bg-gray-100 active:bg-gray-200 flex items-center gap-1`}>
                                    <p>
                                        {selectedCategory}
                                    </p>

                                    <div className={`${!showCategoryOptions && "hidden"}`}>
                                        <LiaAngleUpSolid />
                                    </div>

                                    <div className={`${showCategoryOptions && "hidden"}`}>
                                        <LiaAngleDownSolid />
                                    </div>
                                </div>

                                <div className={`${!showCategoryOptions && " hidden"} min-w-max shadow-md bg-white 
                                absolute top-7 left-0 border-[1px] border-black`}>
                                    {Object.keys(ECategoryType).map((type, index) => (
                                        <p key={index} className={`px-3 py-2 hover:bg-gray-200 active:bg-gray-100`}
                                        onClick={() => setSelectedCategory(type)}>
                                            {type}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider />
                <div className={`w-full md:flex md:justify-center`}>

                    {/*Main topics feed*/}
                    <div className={`w-full md:w-2/3 lg:w-1/2 lg:mx-10 flex flex-col items-center`}>
                        <TopicTile topic={topic} dictionary={dictionary} />
                        <Divider />
                        <TopicTile topic={topic} dictionary={dictionary} />
                        <Divider />
                        <TopicTile topic={topic} dictionary={dictionary} />
                        <Divider />
                        <TopicTile topic={topic} dictionary={dictionary} />
                        <Divider />
                        <TopicTile topic={topic} dictionary={dictionary} />
                        <Divider />
                        <TopicTile topic={topic} dictionary={dictionary} />
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
