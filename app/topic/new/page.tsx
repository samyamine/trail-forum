import React from "react";

export default function NewTopicPage() {

    return (
        <div className={`w-full px-5 py-5 flex flex-col gap-5`}>
            <h1 className={`text-2xl font-bold`}>
                Start a new topic
            </h1>

            <div>
                <div className={`w-full mb-2 flex justify-between items-center`}>
                    <h3 className={`text-md`}>Subject</h3>
                    <p className={`text-xs`}>200</p>
                </div>
                <input id={`subject`} type={`text`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                    border-[1px] border-gray-400 text-sm placeholder-gray-400`}
                       placeholder={`Any advice to improve my performances ?`}/>
            </div>

            <div className={`flex flex-col items-end gap-2`}>
                <p className={`text-xs`}>1500</p>
                <textarea className={`w-full p-2 resize-none overflow-y-auto bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`}
                          rows={10} cols={50} placeholder={`Write your questions here...`}>
                </textarea>
            </div>


            <p className={`text-sm text-justify`}>
                By posting, you acknowledge that you have read and abide by
                our <span className={`underline text-orange-500 cursor-pointer`}> Terms and Conditions.</span>
            </p>

            {/*Category*/}

            <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white text-center cursor-pointer`}>
                Create topic
            </div>
        </div>
    );
}
