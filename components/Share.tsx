import {FaShare} from "react-icons/fa6";
import {TbShare3} from "react-icons/tb";

export default function Share({ dictionary }: { dictionary: any }) {
    return (
        <div className={`px-2 rounded-full cursor-pointer flex gap-1 items-center border-[1px] border-black hover:bg-gray-300 text-xs`}>
            <div>
                <TbShare3 />
            </div>
            <p className={`p-1`}>{dictionary.share}</p>
        </div>
    );
}