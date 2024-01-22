import React from "react";
import {ECategoryType} from "@/lib/enums";
import {IDict} from "@/lib/interfaces";

export default function TopicCategory({ text }: { text: string }) {
    const topicTypeColor: IDict = {
        [ECategoryType.Discussion]: "bg-blue-500",
        [ECategoryType.Gear]: "bg-cyan-400",
        [ECategoryType.Live]: "bg-red-400",
        [ECategoryType.News]: "bg-yellow-500",
        [ECategoryType.Races]: "bg-green-400",
        [ECategoryType.Training]: "bg-purple-400",
    };

    return (
        <div className={`w-fit px-3 py-1 ${topicTypeColor[text]} rounded-full text-xs text-white`}>
            {text}
        </div>
    );
}