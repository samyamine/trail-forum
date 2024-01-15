"use client";

import React, {useState} from "react";
import {useAuth} from "@/app/authContext";
import IconTextButton from "@/components/IconTextButton";
import TopicTile from "@/components/TopicTile";
import Divider from "@/components/Divider";
import CommentTile from "@/components/CommentTile";

enum ETabs {
    Comments = "Comments",
    Saved = "Saved",
    Topics = "Topics",
}

export default function ProfilePage({ params }: { params: { id: string }}) {
    const {user} = useAuth();

    const tabs = {
        [ETabs.Comments]: (
            <div className={`p-5`}>
                {/*<CommentTile />*/}
                {/*<Divider />*/}
                {/*<CommentTile />*/}
                {/*<Divider />*/}
                {/*<CommentTile />*/}
                {/*<Divider />*/}
                COMMENTS
            </div>
        ),
        [ETabs.Saved]: (
            <div>
                SAVED
            </div>
        ),
        [ETabs.Topics]: (
            <div>
                {/*<TopicTile />*/}
                {/*<Divider />*/}
                {/*<TopicTile />*/}
                {/*<Divider />*/}
                {/*<TopicTile />*/}
                TOPICS
            </div>
        ),
    };

    const [selectedTab, setSelectedTab] = useState(ETabs.Topics);

    const isMyProfile = (): boolean => user !== null && user.uid === params.id;

    return (
        <>
            <div className={`px-5 py-3 flex flex-col gap-5 border-b-[1px] border-gray-200`}>
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

                {!isMyProfile() && (
                    <div onClick={() => alert("FOLLOW")}>
                        <IconTextButton text={"Follow"} />
                    </div>
                )}

                <div className={`flex gap-3 items-center`}>
                    <div className={`px-3 py-1 rounded-full active:bg-gray-100 hover:bg-gray-200 cursor-pointer
                    ${selectedTab === ETabs.Topics && "bg-gray-200"}`} onClick={() => setSelectedTab(ETabs.Topics)}>
                        <p>
                            Topics
                        </p>
                    </div>

                    <div className={`px-3 py-1 rounded-full active:bg-gray-100 hover:bg-gray-200 cursor-pointer
                    ${selectedTab === ETabs.Comments && "bg-gray-200"}`} onClick={() => setSelectedTab(ETabs.Comments)}>
                        <p>
                            Comments
                        </p>
                    </div>

                    {/*FIXME*/}
                    {isMyProfile() && (
                        <div className={`px-3 py-1 rounded-full active:bg-gray-100 hover:bg-gray-200 cursor-pointer
                        ${selectedTab === ETabs.Saved && "bg-gray-200"}`} onClick={() => setSelectedTab(ETabs.Saved)}>
                            <p>
                                Saved
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div>
                {tabs[selectedTab]}
            </div>
        </>
    );
}