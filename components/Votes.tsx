import {FaComment, FaDownLong, FaShare, FaUpLong} from "react-icons/fa6";
import {TbArrowBigDown, TbArrowBigUp} from "react-icons/tb";

export default function Votes() {
    return (
        <div className={`rounded-full flex gap-2 items-center border-[1px] border-black text-xs`}>
            <div className={`p-1 rounded-full cursor-pointer hover:bg-gray-300`}>
                <TbArrowBigUp />
            </div>
            <p>2k</p>

            <div className={`p-1 rounded-full cursor-pointer hover:bg-gray-300`}>
                <TbArrowBigDown />
            </div>
        </div>
    );
}