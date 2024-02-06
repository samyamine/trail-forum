import {TbMessageCircle} from "react-icons/tb";
import React from "react";
import EngagementButtonLoading from "@/components/loading/EngagementButtonLoading";
import ProfilePictureLoading from "@/components/loading/ProfilePictureLoading";
import ProfilePicture from "@/components/ProfilePicture";

export default function CommentTileLoading() {
    return (
        <div className={`w-full p-3 text-gray-200`}>
            <div className={`flex justify-between items-center`}>
                <div className={`mb-2 flex items-center gap-2`}>
                    <div className={`w-6 h-6`}>
                        <ProfilePictureLoading />
                    </div>

                    <div className={`w-[150px] h-4 bg-gray-200`}></div>
                </div>
            </div>

            <div className={`w-full h-16 mb-4 bg-gray-200`}></div>

            <div className={`pl-5 pr-3 flex gap-5`}>
                <EngagementButtonLoading />
                <EngagementButtonLoading />
                <EngagementButtonLoading />
            </div>
        </div>
    );
}