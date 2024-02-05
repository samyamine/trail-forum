"use client";

import TopicTile from "@/components/TopicTile";
import Divider from "@/components/Divider";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import AuthPopup from "@/components/AuthPopup";
import IconTextButton from "@/components/IconTextButton";
import {ITopic} from "@/lib/interfaces";
import InitAccountPopup from "@/components/InitAccountPopup";
import {ECategoryType, ETrendType} from "@/lib/enums";
import {usePopup} from "@/app/[lang]/popupContext";
import {getDictionary} from "@/lib/dictionary";
import {feedBuilder, isUndefined} from "@/lib/utils";
import SharePopup from "@/components/SharePopup";
import {useAuth} from "@/app/[lang]/authContext";
import {useCountry} from "@/app/[lang]/countryContext";
import IconTextButtonLoading from "@/components/loading/IconTextButtonLoading";
import TopicTileLoading from "@/components/loading/TopicTileLoading";
import DividerLoading from "@/components/loading/DividerLoading";

export default function HomePage({ params }: {params: { lang: string }}) {
    const {userData} = useAuth();
    const {country} = useCountry();
    const { isAuthPopupVisible, hideAuthPopup, isInitAccountPopupVisible, isSharePopupVisible } = usePopup();

    const trendsRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);

    const [dictionary, setDictionary] = useState<any>();
    const [showTrendOptions, setShowTrendOptions] = useState(false);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [topic, setTopic] = useState<ITopic | null>(null);
    const [topics, setTopics] = useState<ITopic[] | undefined>();
    const [selectedTrend, setSelectedTrend] = useState<ETrendType>(ETrendType.Hot);
    const [selectedCategory, setSelectedCategory] = useState<ECategoryType>(ECategoryType.All);

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
        feedBuilder(selectedCategory, country)
            .then((topics) => setTopics(topics))
            .catch((error) => console.log(error.message));

        return () => {
            window.removeEventListener('click', handleClickOutsideTrend);
            window.removeEventListener('click', handleClickOutsideCategory);
        };
    }, []);

    useEffect(() => {
        feedBuilder(selectedCategory, country)
            .then((topics) => setTopics(topics))
            .catch((error) => console.log(error.message));
    }, [selectedCategory, country]);

    return (
        <>
            {/*Signin popup*/}
            {isAuthPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {isInitAccountPopupVisible && (
                <InitAccountPopup dictionary={dictionary} />
            )}

            {isSharePopupVisible && (
                <SharePopup dictionary={dictionary} />
            )}

            {!isUndefined(topics) && !isUndefined(dictionary) ? (
                <div className={`w-full overflow-y-auto`}>
                    <div className={`md:w-2/3 lg:w-1/2 w-full max-[365px]:px-2 px-5 py-3`}>
                        {/*New topic bar*/}
                        <div className={`w-full flex justify-between md:justify-start md:gap-5 items-center`}>
                            <Link href={`/topic/new`}>
                                <IconTextButton text={dictionary.main.newTopic} />
                            </Link>

                            {/*Sort Options*/}
                            <div className={`flex text-xs`}>
                                {/*Trends*/}
                                {/*<div ref={trendsRef} className={`relative flex items-center gap-1 cursor-pointer`}*/}
                                {/*    onClick={() => setShowTrendOptions(!showTrendOptions)}>*/}
                                {/*    <div className={`max-[340px]:px-2 px-3 py-1 ${showTrendOptions && "bg-gray-200"} rounded-full */}
                                {/*    hover:bg-gray-100 active:bg-gray-200 flex items-center gap-1`}>*/}
                                {/*        <p>*/}
                                {/*            {dictionary.main.trends[selectedTrend]}*/}
                                {/*        </p>*/}

                                {/*        <div className={`${!showTrendOptions && "hidden"}`}>*/}
                                {/*            <LiaAngleUpSolid />*/}
                                {/*        </div>*/}

                                {/*        <div className={`${showTrendOptions && "hidden"}`}>*/}
                                {/*            <LiaAngleDownSolid />*/}
                                {/*        </div>*/}
                                {/*    </div>*/}

                                {/*    <div className={`${!showTrendOptions && " hidden"} min-w-max shadow-md bg-white */}
                                {/*    absolute top-7 left-0 border-[1px] border-black`}>*/}
                                {/*        {Object.keys(ETrendType).map((type, index) => (*/}
                                {/*            <p key={index} className={`px-3 py-2 hover:bg-gray-200 active:bg-gray-100`}*/}
                                {/*            onClick={() => setSelectedTrend(type as ETrendType)}>*/}
                                {/*                {dictionary.main.trends[type]}*/}
                                {/*            </p>*/}
                                {/*        ))}*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                {/*Categories*/}
                                <div ref={categoriesRef} className={`cursor-pointer relative`}
                                     onClick={() => setShowCategoryOptions(!showCategoryOptions)}>
                                    <div className={`max-[340px]:px-2 px-3 py-1 ${showCategoryOptions && "bg-gray-200"} rounded-full 
                                hover:bg-gray-100 active:bg-gray-200 flex items-center gap-1`}>
                                        <p>
                                            {dictionary.main.categories[selectedCategory]}
                                        </p>

                                        <div className={`${!showCategoryOptions && "hidden"}`}>
                                            <LiaAngleUpSolid />
                                        </div>

                                        <div className={`${showCategoryOptions && "hidden"}`}>
                                            <LiaAngleDownSolid />
                                        </div>
                                    </div>

                                    <div className={`${!showCategoryOptions && " hidden"} min-w-max shadow-md bg-white 
                                absolute top-7 right-0 md:right-1/2 md:translate-x-1/2 border-[1px] border-black`}>
                                        {Object.keys(ECategoryType).map((type, index) => (
                                            <p key={index} className={`px-3 py-2 hover:bg-gray-200 active:bg-gray-100`}
                                               onClick={() => setSelectedCategory(type as ECategoryType)}>
                                                {dictionary.main.categories[type]}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider />
                    <div className={`w-full min-h-[300px] md:flex md:justify-center`}>

                        {/*Main topics feed*/}
                        {topics?.length === 0 ? (
                            <div className={`text-center mt-10`}>
                                <p>
                                    No result.
                                </p>
                            </div>
                        ) : (
                            <div className={`w-full md:w-2/3 lg:w-1/2 lg:mx-10 flex flex-col items-center`}>
                                {topics?.map((topic, index) => (
                                    <div className={`w-full`} key={index}>
                                        <TopicTile topic={topic} dictionary={dictionary} />
                                        <Divider />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className={`w-full overflow-y-auto`}>
                    <div className={`md:w-2/3 lg:w-1/2 w-full max-[365px]:px-2 px-5 py-3`}>
                        {/*New topic bar*/}
                        <div className={`w-full flex justify-between md:justify-start md:gap-5 items-center`}>
                            {/*FIXME: Translation*/}
                            <IconTextButtonLoading />

                            {/*Sort Options*/}
                            <div className={`flex text-xs`}>
                                {/*Trends*/}

                                {/*Categories*/}
                                <div>
                                    <div className={`max-[340px]:px-2 px-3 py-1 bg-gray-200 rounded-full 
                                        flex items-center gap-1 text-gray-200 animate-pulse`}>
                                        <p>
                                            Random Text
                                        </p>

                                        <LiaAngleUpSolid />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`w-full min-h-[300px] md:flex md:justify-center`}>
                        <div className={`w-full md:w-2/3 lg:w-1/2 lg:mx-10 flex flex-col items-center`}>
                            <div className={`w-full`}>
                                <DividerLoading />
                                <TopicTileLoading />
                                <DividerLoading />
                                <TopicTileLoading />
                                <DividerLoading />
                                <TopicTileLoading />
                                <DividerLoading />
                                <TopicTileLoading />
                                <DividerLoading />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
