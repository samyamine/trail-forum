import { FaUpLong } from "react-icons/fa6";
import { FaDownLong } from "react-icons/fa6";
import { FaComment } from "react-icons/fa6";
import { FaShare } from "react-icons/fa6";
import Link from "next/link";
import Votes from "@/components/Votes";
import Comments from "@/components/Comments";
import Share from "@/components/Share";


export default function TopicTile() {
    return (
        <Link href={`/topic`}>
            <div className={`w-full p-3 text-gray-900 cursor-pointer active:bg-gray-100`}>
                <div className={`mb-2 flex items-center gap-2`}>
                    <div className={`w-6 h-6 bg-red-400 rounded-full`}>

                    </div>
                    <p className={`text-sm`}>
                        user - <span className={`text-gray-500`}>1h ago</span>
                    </p>
                </div>
                <h1 className={`mb-4 text-xl font-bold`}>
                    What are the best shoes for top trail performance ?
                </h1>

                <div className={`flex gap-5`}>
                    <Votes />
                    <Comments />
                    <Share />
                </div>
            </div>
        </Link>
    );
}