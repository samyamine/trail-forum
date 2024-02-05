"use client";

import {TbShare3} from "react-icons/tb";
import React, {useState} from "react";

export default function Share({ dictionary, onClickCallback }: { dictionary: any, onClickCallback: React.MouseEventHandler<HTMLDivElement> }) {
    return (
        <div className={`px-2 rounded-full cursor-pointer flex gap-1 items-center border-[1px] border-black 
            hover:bg-gray-300 text-xs`} onClick={onClickCallback}>
            <div>
                <TbShare3 />
            </div>
            <p className={`p-1`}>
                {dictionary.share}
            </p>
        </div>
    );
}