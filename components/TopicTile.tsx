import Link from "next/link";
import Votes from "@/components/Votes";
import Comments from "@/components/Comments";
import Share from "@/components/Share";
import TopicCategory from "@/components/TopicCategory";
import React, {useState} from "react";
import {topicTypeColor} from "@/lib/consts";
import ProfilePicture from "@/components/ProfilePicture";
import {SlOptions} from "react-icons/sl";
import {TbFlag} from "react-icons/tb";

export default function TopicTile() {
    return (
        <div className={`w-full h-fit pb-3 text-gray-900 cursor-pointer`}>
            {/*FIXME*/}
            <Link href={`/topic/JeikBzLEROcPWF5pIA7N`} className={`w-full p-3 block`}>
                {/*FIXME*/}
                <object>
                    <Link href={`/profile/6iebEH70VOd8Jw8lianG2ptIVvi1`}
                          className={`w-fit mb-2 flex items-center gap-2`}>
                        <div className={`w-6 h-6`}>
                            {/*FIXME*/}
                            <ProfilePicture />
                        </div>
                        <p className={`text-sm`}>
                            user - <span className={`text-gray-500`}>1h ago</span>
                        </p>
                    </Link>
                </object>


                <h1 className={`mb-2 text-xl font-bold`}>
                    What are the best shoes for top trail performance ?
                </h1>

                <div className={`mb-2`}>
                    {/*FIXME*/}
                    {/*String(topicTypeColor.Gear)*/}
                    <TopicCategory text={"Discussion"} />
                </div>
            </Link>

            <div className={`flex`}>
                <div className={`px-3 w-fit flex gap-5`}>
                    {/*FIXME*/}
                    <Votes id={`TEST`} count={0} />
                    <Comments count={0} />
                    <Share />
                </div>

                {/*FIXME*/}
                <Link href={`/topic/JeikBzLEROcPWF5pIA7N`} className={`flex-grow`}></Link>
            </div>
        </div>
    );
}