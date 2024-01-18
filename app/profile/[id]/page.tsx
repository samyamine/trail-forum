"use client";

import React, {useEffect, useState} from "react";
import {useAuth} from "@/app/authContext";
import IconTextButton from "@/components/IconTextButton";
import TopicTile from "@/components/TopicTile";
import Divider from "@/components/Divider";
import CommentTile from "@/components/CommentTile";
import {IComment, ITopic} from "@/lib/interfaces";
import {Toaster} from "react-hot-toast";
import {isUndefined} from "@/lib/utils";
import {isTopic} from "@/lib/types";

enum ETabs {
    Comments = "Comments",
    Saved = "Saved",
    Topics = "Topics",
}

interface IData {
    topics: ITopic[],
    comments: IComment[],
}

export default function ProfilePage({ params }: { params: { id: string }}) {
    const {userData} = useAuth();

    const [data, setData] = useState<IData>({comments: [], topics: []});

    const tabs = {
        [ETabs.Comments]: (
            <div>
                {userData?.comments.map((comment, index) => (
                    <div key={index}>
                        <div className={`px-3`}>
                            <CommentTile comment={comment} />
                        </div>
                        <Divider />
                    </div>
                ))}
            </div>
        ),
        [ETabs.Saved]: (
            <div>
                {userData?.saved.map((element, index) => (
                    <div key={index}>
                        {isTopic(element) ? (
                            <TopicTile topic={element} />
                        ) : (
                            <div className={`px-5`}>
                                <CommentTile comment={element} />
                            </div>
                        )}
                        <Divider />
                    </div>
                ))}
            </div>
        ),
        [ETabs.Topics]: (
            <div>
                {userData?.topics.map((topic, index) => (
                    <div key={index}>
                        <TopicTile topic={topic} />
                        <Divider />
                    </div>
                ))}
            </div>
        ),
    };

    const [selectedTab, setSelectedTab] = useState(ETabs.Topics);

    const isMyProfile = (): boolean => !isUndefined(userData) && userData?.uid === params.id;

    return (
        <>
            <Toaster />
            <div className={`flex flex-col gap-2`}>
                <div className={`px-5 py-3`}>
                    <div className={`flex items-center gap-5`}>
                        <div className={`w-12 h-12 bg-red-400 rounded-full`}>
                            {/*FIXME*/}
                        </div>

                        <div className={`flex flex-col justify-between`}>
                            <h1 className={`text-lg font-bold`}>
                                La_zone_du_66
                            </h1>

                            <div className={`flex items-center gap-5 text-xs`}>
                                <p>
                                    23 Followers
                                </p>

                                <p>
                                    10 Following
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {!isMyProfile() && (
                    <div className={`px-5`} onClick={() => alert("FOLLOW")}>
                        <IconTextButton text={"Follow"} />
                    </div>
                )}

                <div className={`flex justify-between items-center border-b-[1px] border-gray-200`}>
                    <div className={`w-1/3 py-1 flex justify-center items-center active:bg-gray-100 hover:bg-gray-200 
                cursor-pointer ${selectedTab === ETabs.Topics && "text-orange-500 border-b-[1px] border-orange-500"}`}
                         onClick={() => setSelectedTab(ETabs.Topics)}>
                        <p>
                            Topics
                        </p>
                    </div>

                    <div className={`w-1/3 py-1 flex justify-center items-center active:bg-gray-100 hover:bg-gray-200 
                cursor-pointer ${selectedTab === ETabs.Comments && "text-orange-500 border-b-[1px] border-orange-500"}`}
                         onClick={() => setSelectedTab(ETabs.Comments)}>
                        <p>
                            Comments
                        </p>
                    </div>

                    {/*FIXME*/}
                    {isMyProfile() && (
                        <div className={`w-1/3 py-1 flex justify-center items-center active:bg-gray-100 hover:bg-gray-200 
                    cursor-pointer ${selectedTab === ETabs.Saved && "text-orange-500 border-b-[1px] border-orange-500"}`}
                             onClick={() => setSelectedTab(ETabs.Saved)}>
                            <p>
                                Saved
                            </p>
                        </div>
                    )}
                </div>


                {/*<div className={`px-5 py-3 flex flex-col gap-5 border-b-[1px] border-gray-200`}>*/}
                {/*    <div className={`flex items-center gap-5`}>*/}
                {/*        <div className={`w-12 h-12 bg-red-400 rounded-full`}>*/}
                {/*            /!*FIXME*!/*/}
                {/*        </div>*/}

                {/*        <div className={`flex flex-col justify-between`}>*/}
                {/*            <h1 className={`text-lg font-bold`}>*/}
                {/*                La_zone_du_66*/}
                {/*            </h1>*/}

                {/*            <div className={`flex items-center gap-5 text-xs`}>*/}
                {/*                <p>*/}
                {/*                    23 Followers*/}
                {/*                </p>*/}

                {/*                <p>*/}
                {/*                    10 Following*/}
                {/*                </p>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    {!isMyProfile() && (*/}
                {/*        <div onClick={() => alert("FOLLOW")}>*/}
                {/*            <IconTextButton text={"Follow"} />*/}
                {/*        </div>*/}
                {/*    )}*/}

                {/*    <div className={`flex justify-between items-center bg-yellow-300`}>*/}
                {/*        <div className={`px-3 py-1 rounded-full active:bg-gray-100 hover:bg-gray-200 cursor-pointer*/}
                {/*        ${selectedTab === ETabs.Topics && "bg-gray-200"}`} onClick={() => setSelectedTab(ETabs.Topics)}>*/}
                {/*            <p>*/}
                {/*                Topics*/}
                {/*            </p>*/}
                {/*        </div>*/}

                {/*        <div className={`px-3 py-1 rounded-full active:bg-gray-100 hover:bg-gray-200 cursor-pointer*/}
                {/*        ${selectedTab === ETabs.Comments && "bg-gray-200"}`} onClick={() => setSelectedTab(ETabs.Comments)}>*/}
                {/*            <p>*/}
                {/*                Comments*/}
                {/*            </p>*/}
                {/*        </div>*/}

                {/*        /!*FIXME*!/*/}
                {/*        {isMyProfile() && (*/}
                {/*            <div className={`px-3 py-1 rounded-full active:bg-gray-100 hover:bg-gray-200 cursor-pointer*/}
                {/*            ${selectedTab === ETabs.Saved && "bg-gray-200"}`} onClick={() => setSelectedTab(ETabs.Saved)}>*/}
                {/*                <p>*/}
                {/*                    Saved*/}
                {/*                </p>*/}
                {/*            </div>*/}
                {/*        )}*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div>
                    {tabs[selectedTab]}
                </div>
            </div>
        </>
    );
}