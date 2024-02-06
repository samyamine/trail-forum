import {TbShare3} from "react-icons/tb";
import React from "react";

export default function EngagementButtonLoading() {
    return (
        <div className={`px-2 rounded-full flex gap-1 items-center border-[1px] border-gray-200 
            bg-gray-200 text-xs text-gray-200`}>
            <div>
                <TbShare3 />
            </div>
            <p className={`p-1`}>
                TEXT
            </p>
        </div>
    );
}