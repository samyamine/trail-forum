import {FaPlus} from "react-icons/fa6";
import React from "react";

export default function IconTextButton({ text }: {text: string}) {
    return (
        <div className={`w-fit px-3 py-1 flex items-center gap-2 bg-orange-500 rounded-sm shadow-md 
            active:shadow-sm text-white text-sm cursor-pointer`}>
            <FaPlus />
            <p>{text}</p>
        </div>
    );
}