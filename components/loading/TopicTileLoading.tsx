import Link from "next/link";
import ProfilePicture from "@/components/ProfilePicture";
import {formatTime} from "@/lib/topic/utils";
import TopicCategory from "@/components/TopicCategory";
import Votes from "@/components/Votes";
import Comments from "@/components/Comments";
import Share from "@/components/Share";
import React from "react";
import ProfilePictureLoading from "@/components/loading/ProfilePictureLoading";
import {TbShare3} from "react-icons/tb";
import TopicCategoryLoading from "@/components/loading/TopicCategoryLoading";
import EngagementButtonLoading from "@/components/loading/EngagementButtonLoading";

export default function TopicTileLoading() {
    return (
        <div className={`w-full h-fit pb-3 text-gray-200 md:border-l-[1px] 
        md:border-r-[1px] md:border-gray-200`}>
            <div className={`w-full p-3 block`}>
                <div className={`w-fit mb-2 flex items-center gap-2`}>
                    <div className={`w-6 h-6`}>
                        <ProfilePictureLoading />
                    </div>

                    <div className={`w-[200px] h-4 bg-gray-200`}></div>
                </div>

                <div className={`w-[100px] h-5 mb-2 bg-gray-200`}></div>

                <div className={`mb-2`}>
                    <TopicCategoryLoading />
                </div>
            </div>

            <div className={`flex`}>
                <div className={`px-3 w-fit flex gap-5`}>
                    <EngagementButtonLoading />
                    <EngagementButtonLoading />
                    <EngagementButtonLoading />
                </div>
            </div>
        </div>
    );
}