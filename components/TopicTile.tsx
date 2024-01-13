import { FaUpLong } from "react-icons/fa6";
import { FaDownLong } from "react-icons/fa6";
import { FaComment } from "react-icons/fa6";
import Link from "next/link";
import Votes from "@/components/Votes";
import Comments from "@/components/Comments";
import Share from "@/components/Share";
import TopicCategory from "@/components/TopicCategory";
import React from "react";
import {topicTypeColor} from "@/lib/consts";

export default function TopicTile() {
    return (
        <div className={`w-full p-3 text-gray-900 cursor-pointer active:bg-gray-100`}>
            <Link href={`/topic/JeikBzLEROcPWF5pIA7N`}>
                <div className={`mb-2 flex items-center gap-2`}>
                    <div className={`w-6 h-6 bg-red-400 rounded-full`}>

                    </div>
                    <p className={`text-sm`}>
                        user - <span className={`text-gray-500`}>1h ago</span>
                    </p>
                </div>
                <h1 className={`mb-2 text-xl font-bold`}>
                    What are the best shoes for top trail performance ?
                </h1>

                <div className={`mb-4`}>
                    <TopicCategory text={"Discussion"} color={topicTypeColor.Gear} />
                </div>
            </Link>

            <div className={`flex gap-5`}>
                <Votes count={0} />
                <Comments count={0} />
                <Share />
            </div>
        </div>
    );
}