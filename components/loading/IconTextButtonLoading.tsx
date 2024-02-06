import {FaPlus} from "react-icons/fa6";
import React from "react";

export default function IconTextButtonLoading() {
    return (
        <div className={`w-fit px-3 py-1 flex items-center gap-2 bg-gray-200 rounded-sm 
                max-[340px]:text-xs text-sm text-gray-200`}>
            <FaPlus />

            <p>
                Random Text
            </p>
        </div>
    );
}