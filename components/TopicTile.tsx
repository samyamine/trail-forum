import Link from "next/link";
import Votes from "@/components/Votes";
import Comments from "@/components/Comments";
import Share from "@/components/Share";
import TopicCategory from "@/components/TopicCategory";
import React, {useEffect, useState} from "react";
import {topicTypeColor} from "@/lib/consts";
import ProfilePicture from "@/components/ProfilePicture";
import {SlOptions} from "react-icons/sl";
import {TbFlag} from "react-icons/tb";
import {ITopic, IUser} from "@/lib/interfaces";
import {DocumentSnapshot, getDoc} from "@firebase/firestore";
import {getAuthor} from "@/lib/topic/utils";
import toast from "react-hot-toast";

export default function TopicTile({ topic }: { topic: ITopic }) {
    const [author, setAuthor] = useState<IUser | null>(null);
    const [commentCount, setCommentCount] = useState(0);

    const getCurrentDate = () => {
        const now = new Date();
        return Math.floor(now.getTime() / 1000) - topic.creationDate.seconds;
    };

    useEffect(() => {

        const init = async () => {
            const authorData = await getAuthor(topic.author);
            let initCount = 0;

            for (const reference of topic.comments) {
                const comment = await getDoc(reference);

                initCount += comment.data()?.answers.length + 1;
            }

            setCommentCount(initCount);
            setAuthor(authorData);
        };

        init().catch((error) => toast.error(error.message));
    }, []);

    return author === null ?
        (
            <div>
                Loading...
            </div>
        ) : (
        <div className={`w-full h-fit pb-3 text-gray-900 cursor-pointer`}>
            {/*FIXME*/}
            <Link href={`/topic/${topic.uid}`} className={`w-full p-3 block`}>
                {/*FIXME*/}
                <object>
                    <Link href={`/profile/6iebEH70VOd8Jw8lianG2ptIVvi1`}
                          className={`w-fit mb-2 flex items-center gap-2`}>
                        <div className={`w-6 h-6`}>
                            {/*FIXME*/}
                            <ProfilePicture />
                        </div>
                        <p className={`text-sm`}>
                            {author.username} - <span className={`text-gray-500`}>{getCurrentDate()} ago</span>
                        </p>
                    </Link>
                </object>


                <h1 className={`mb-2 text-xl font-bold`}>
                    {topic.title}
                </h1>

                <div className={`mb-2`}>
                    {/*FIXME*/}
                    {/*String(topicTypeColor.Gear)*/}
                    <TopicCategory text={topic.category} />
                </div>
            </Link>

            <div className={`flex`}>
                <div className={`px-3 w-fit flex gap-5`}>
                    {/*FIXME*/}
                    <Votes id={topic.uid} collection={`topics`} initCount={topic.upVoted.length - topic.downVoted.length} />
                    <Comments count={commentCount} />
                    <Share />
                </div>

                {/*FIXME*/}
                <Link href={`/topic/${topic.uid}`} className={`flex-grow`}></Link>
            </div>
        </div>
    );
}