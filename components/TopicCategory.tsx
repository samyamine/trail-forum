import React from "react";
import {ETopicType} from "@/lib/enums";

export default function TopicCategory({ text }: { text: string }) {
    const topicTypeColor: IDict = {
        [ETopicType.Discussion]: "bg-blue-500",
        [ETopicType.Gear]: "bg-cyan-400",
        [ETopicType.Live]: "bg-red-400",
        [ETopicType.News]: "bg-yellow-500",
        [ETopicType.Races]: "bg-green-400",
        [ETopicType.Training]: "bg-purple-400",
    };

    return (
        <div className={`w-fit px-3 py-1 ${topicTypeColor[text]} rounded-full text-xs text-white`}>
            {text}
        </div>
    );
}