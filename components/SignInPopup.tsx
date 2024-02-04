"use client";

import {FcGoogle} from "react-icons/fc";
import React, {useState} from "react";
import {useAuth} from "@/app/[lang]/authContext";
import toast, {Toaster} from "react-hot-toast";
import {usePopup} from "@/app/[lang]/popupContext";

export default function SignInPopup({ dictionary, onClickCallback }: { dictionary: any, onClickCallback: React.MouseEventHandler<HTMLDivElement>}) {
    const {signInWithEmail, googleSignIn} = useAuth();
    const {hideAuthPopup, showInitAccountPopup} = usePopup();

    // FIXME: useRef
    const [charging, setCharging] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignInEmail = async () => {
        try {
            setCharging(true);
            await signInWithEmail(email, password);
            setCharging(false);
            hideAuthPopup();
        } catch (error: any) {
            toast.error(error.message);
            setCharging(false);
        }
    };

    const handleSignInGoogle = async () => {
        try {
            const firstTimeSignIn = await googleSignIn();
            console.log(`FIRST TIME GOOGLE SIGN IN ? ${firstTimeSignIn}`);
            if (firstTimeSignIn) {
                hideAuthPopup();
                showInitAccountPopup();
                console.log("firstTimeSignIn TRUE")
            }
            else {
                hideAuthPopup();
                console.log("firstTimeSignIn FALSE")
                toast.success("You are now logged in");
            }
        } catch (error: any) {
            toast.error(`ERROR: ${error.message}`);
        }
    };

    return (
        <div className={`w-full max-w-[320px] flex flex-col items-center`}>
            <Toaster toastOptions={{ duration: 3000 }} />

            <h2 className={`mb-10 text-2xl font-bold`}>
                {dictionary.signIn.signIn}
            </h2>

            <div className={`w-full max-md:px-3 flex flex-col text-center`}>
                <div className={`w-full px-5 py-2 rounded-lg border-[1px] border-black flex 
                    justify-center items-center gap-5 cursor-pointer text-xl`}
                    onClick={handleSignInGoogle}>
                    <FcGoogle />

                    <p className={`text-base`}>
                        {dictionary.register.google}
                    </p>
                </div>

                <div className={`w-full my-5 flex justify-between items-center`}>
                    <div className={`w-1/2 h-[1px] mr-3 bg-black`}></div>
                    {dictionary.register.or}
                    <div className={`w-1/2 h-[1px] ml-3 bg-black`}></div>
                </div>

                <div className={`w-full mb-10 flex flex-col items-center gap-5`}>
                    <input type={`text`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                    border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={dictionary.register.email}
                    onChange={(event) => setEmail(event.target.value)} value={email}/>

                    <input type={`password`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                    border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={dictionary.register.password}
                    onChange={(event) => setPassword(event.target.value)} value={password}/>
                </div>

                <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white cursor-pointer`}
                onClick={handleSignInEmail}>
                    {charging ? `${dictionary.loading}...` : `${dictionary.signIn.signIn}`}
                </div>

                <div className={`flex justify-center gap-1 text-sm`}>
                    <p>
                        {dictionary.signIn.notRegistered}
                    </p>
                    <div className={`text-orange-500 underline cursor-pointer`} onClick={onClickCallback}>
                        {dictionary.register.register}
                    </div>
                </div>
            </div>

        </div>
    );
}