"use client";

import {FcGoogle} from "react-icons/fc";
import React, {useState} from "react";
import {useAuth} from "@/app/authContext";
import toast, {Toaster} from "react-hot-toast";
import {usePopup} from "@/app/popupContext";
import {sign} from "crypto";

export default function SignInPopup({ onClickCallback }: {onClickCallback:  React.MouseEventHandler<HTMLDivElement>}) {
    const {signInWithEmail, googleSignIn} = useAuth();
    const {hidePopup, showUsernamePopup} = usePopup();

    // FIXME: useRef
    const [charging, setCharging] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignInEmail = async () => {
        try {
            setCharging(true);
            await signInWithEmail(email, password);
            setCharging(false);
            hidePopup();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleSignInGoogle = async () => {
        try {
            const firstTimeSignIn = await googleSignIn();
            if (firstTimeSignIn) {
                hidePopup();
                showUsernamePopup();
            }
            else {
                hidePopup();
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <>
            <Toaster />
            <h2 className={`mb-10 text-2xl font-bold`}>
                Sign in
            </h2>

            <div className={`w-1/2 md:w-[400px] px-5 py-2 rounded-lg border-[1px] border-black flex 
                justify-center items-center gap-5 cursor-pointer text-xl`}
                onClick={handleSignInGoogle}>
                <FcGoogle />

                <p className={`text-base`}>
                    Continue with Google
                </p>
            </div>

            <div className={`w-1/2 md:w-[400px] my-5 flex justify-between items-center`}>
                <div className={`w-1/2 h-[1px] mr-3 bg-black`}></div>
                Or
                <div className={`w-1/2 h-[1px] ml-3 bg-black`}></div>
            </div>

            <div className={`w-1/2 md:w-[400px] mb-10 flex flex-col items-center gap-5`}>
                <input type={`text`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={`Email`}
                onChange={(event) => setEmail(event.target.value)} value={email}/>

                <input type={`password`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={`Password`}
                onChange={(event) => setPassword(event.target.value)} value={password}/>
            </div>

            <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white cursor-pointer`}
            onClick={handleSignInEmail}>
                {charging ? "Loading..." : "Sign In"}
            </div>

            <div className={`flex gap-1 text-sm`}>
                <p>
                    Don't have an account ?
                </p>
                <div className={`text-orange-500 underline cursor-pointer`} onClick={onClickCallback}>
                    Register
                </div>
            </div>
        </>
    );
}