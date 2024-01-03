import { FaUpLong } from "react-icons/fa6";
import { FaDownLong } from "react-icons/fa6";
import { FaComment } from "react-icons/fa6";
import { FaShare } from "react-icons/fa6";


export default function TopicTile() {
    return (
        <div className={`w-full p-3 text-gray-900`}>
            <p className={`mb-2 text-sm`}>
                user - <span>1h ago</span>
            </p>
            <h1 className={`mb-4 text-xl font-bold`}>
                What are the best shoes for top trail performance ?
            </h1>

            <div className={`flex gap-5 text-xs`}>
                <div className={`rounded-full flex gap-2 items-center border-[1px] border-black`}>
                    <div className={`p-1 rounded-full cursor-pointer hover:bg-gray-300`}>
                        <FaUpLong />
                    </div>
                    <p>2k</p>

                    <div className={`p-1 rounded-full cursor-pointer hover:bg-gray-300`}>
                        <FaDownLong />
                    </div>
                </div>

                <div className={`px-2 rounded-full cursor-pointer flex gap-1 items-center border-[1px] border-black hover:bg-gray-300`}>
                    <div>
                        <FaComment />
                    </div>
                    <p className={`p-1`}>2k</p>
                </div>

                <div className={`px-2 rounded-full cursor-pointer flex gap-1 items-center border-[1px] border-black hover:bg-gray-300`}>
                    <div>
                        <FaShare />
                    </div>
                    <p className={`p-1`}>Share</p>
                </div>
            </div>
        </div>
    );
}