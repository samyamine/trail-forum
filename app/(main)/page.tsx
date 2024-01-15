"use client";

import TopicTile from "@/components/TopicTile";
import Divider from "@/components/Divider";
import { FaPlus } from "react-icons/fa6";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import React, {useEffect, useState} from "react";
import {usePopup} from "@/app/popupContext";
import Link from "next/link";
import AuthPopup from "@/components/AuthPopup";
import ProfilePicture from "@/components/ProfilePicture";
import IconTextButton from "@/components/IconTextButton";
import {doc, DocumentData, getDoc} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {getAuthor, getTopic, getTopicComments} from "@/lib/topic/utils";
import toast from "react-hot-toast";
import {ITopic} from "@/lib/interfaces";

export default function HomePage() {
    const { isPopupVisible, hidePopup } = usePopup();

    const [showSortOptions, setShowSortOptions] = useState(false);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [topic, setTopic] = useState<ITopic | null>(null);


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

    useEffect(() => {
        getTopic("JeikBzLEROcPWF5pIA7N")
            .then((topicData) => setTopic(topicData))
            .catch((error) => toast.error(error.message));
    }, []);

    // useEffect(() => {
    //     const fetchAllTopicData = async () => {
    //         const topicRef = doc(db, "topics", "JeikBzLEROcPWF5pIA7N");
    //         const topicSnapshot = await getDoc(topicRef);
    //
    //         if (topicSnapshot.exists()) {
    //             const author = await getAuthor(topicSnapshot.data().author);
    //             const comments = await getTopicComments(topicSnapshot.data().comments);
    //
    //             setTopic({
    //                 id: topicSnapshot.id,
    //                 author: author.data() as DocumentData,
    //                 body: topicSnapshot.data().body,
    //                 category: topicSnapshot.data().category,
    //                 comments,
    //                 creationDate: topicSnapshot.data().creationDate,
    //                 title: topicSnapshot.data().title,
    //                 votes: topicSnapshot.data().votes,
    //             });
    //         }
    //     };
    //
    //     fetchAllTopicData().catch((error) => toast.error(error.message));
    // }, []);

    return topic !== null ? (
        <>
            {/*Signin popup*/}
            {isPopupVisible && (
                <AuthPopup />
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
                                    <p>Following</p>
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
        <div>
            Loading...
        </div>
    );
}
