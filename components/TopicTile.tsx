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
import {formatTime, getAuthor} from "@/lib/topic/utils";
import toast from "react-hot-toast";
import {usePopup} from "@/app/[lang]/popupContext";
import TopicTileLoading from "@/components/loading/TopicTileLoading";

export default function TopicTile({ topic, dictionary }: { topic: ITopic, dictionary: any }) {
    const {showSharePopup} = usePopup();

    const [author, setAuthor] = useState<IUser | null>(null);
    const [commentCount, setCommentCount] = useState(0);

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
            <div className={`animate-pulse`}>
                <TopicTileLoading />
            </div>
        ) : (
        <div className={`w-full h-fit pb-3 text-gray-900 md:hover:bg-gray-100 cursor-pointer
            md:border-l-[1px] md:border-r-[1px] md:border-gray-900`}>
            {/*FIXME*/}
            <Link href={`/topic/${topic.uid}`} className={`w-full p-3 block`}>
                {/*FIXME*/}
                <object>
                    <Link href={`/profile/${author.uid}`} className={`w-fit mb-2 flex items-center gap-2`}>
                        <div className={`w-6 h-6`}>
                            {/*FIXME*/}
                            <ProfilePicture />
                        </div>
                        <p className={`text-sm`}>
                            {author.username} - <span className={`text-gray-500`}>{formatTime(topic.creationDate, dictionary)}</span>
                        </p>
                    </Link>
                </object>


                <h1 className={`mb-2 text-xl font-bold`}>
                    {topic.title}
                </h1>

                <div className={`mb-2`}>
                    {/*FIXME*/}
                    {/*String(topicTypeColor.Gear)*/}
                    <TopicCategory text={topic.category} dictionary={dictionary} />
                </div>
            </Link>

            <div className={`flex`}>
                <div className={`px-3 w-fit flex gap-5`}>
                    {/*FIXME*/}
                    <Votes id={topic.uid} collection={`topics`} initUpVotes={topic.upVoted.length}
                        initDownVotes={topic.downVoted.length} />
                    <Link href={`/topic/${topic.uid}`}>
                        <Comments count={commentCount} />
                    </Link>
                    <Share dictionary={dictionary} onClickCallback={() => showSharePopup(topic.uid)} />
                </div>

                {/*FIXME*/}
                <Link href={`/topic/${topic.uid}`} className={`flex-grow`}></Link>
            </div>
        </div>
    );
}