import {FaComment, FaShare} from "react-icons/fa6";
import {TbMessageCircle} from "react-icons/tb";

export default function Comments() {
    return (
        <div className={`px-2 rounded-full cursor-pointer flex gap-1 items-center border-[1px] border-black hover:bg-gray-300 text-xs`}>
            <div>
                <TbMessageCircle />
            </div>
            <p className={`p-1`}>2k</p>
        </div>
    );
}