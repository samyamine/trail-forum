import {Toaster} from "react-hot-toast";
import React, {useState} from "react";
import {useAuth} from "@/app/authContext";
import {usePopup} from "@/app/popupContext";

export default function UsernamePopup() {
    const {user, userData} = useAuth();
    const {hideUsernamePopup} = usePopup();

    const [username, setUsername] = useState(userData?.username);
    const [charging, setCharging] = useState(false);

    const publishUsername = async () => {
        // FIXME
    };

    return (
        <div className={`w-full h-full bg-white fixed top-0 z-50 flex flex-col justify-center items-center`}>
            <Toaster />
            <h2 className={`mb-10 text-2xl font-bold`}>
                Create your username
            </h2>

            <p className={`px-5 py-2 mb-5 text-center`}>
                #COMPANY_NAME is completely anonymous and all your interactions will be published
                under your username. Pay attention because you won't be able to change it later.
            </p>

            <div className={`w-full md:w-[400px] mb-10 flex flex-col items-center gap-1`}>
                <input type={`text`} className={`w-1/2 px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={`Username`}/>
            </div>

            <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white cursor-pointer`}
                 onClick={() => alert("FIXME")}>
                {charging ? "Loading..." : "Finish"}
            </div>
        </div>
    );
}