"use client";

import React, {useState} from "react";
import {TfiClose} from "react-icons/tfi";
import {FcGoogle} from "react-icons/fc";
import SignInPopup from "@/components/SignInPopup";
import {BsArrowRight} from "react-icons/bs";
import {createUserWithEmailAndPassword} from "@firebase/auth";
import {collection, doc, getDocs, query, setDoc, where} from "@firebase/firestore";
import {auth, db} from "@/lib/firebase/config";
import toast, {Toaster} from "react-hot-toast";
import {useAuth} from "@/app/authContext";
import {usePopup} from "@/app/popupContext";
import {isUsernameAvailable} from "@/lib/utils";

export default function RegisterPopup({ index, setIndexCallback, onSwitchAuthType }: {index: number, setIndexCallback:  () => void, onSwitchAuthType:  React.MouseEventHandler<HTMLDivElement>}) {
    const {user, signUpWithEmail, googleSignIn} = useAuth();
    const {hidePopup, showUsernamePopup} = usePopup();

    const handleSignInGoogle = async () => {
        try {
            const firstTimeSignIn = await googleSignIn();
            if (firstTimeSignIn) {
                hidePopup();
                showUsernamePopup();
            }
            else {
                hidePopup();
                toast.success("You are now logged in");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9_-]{4,}$/;
    const passwordRegex = /^(?=.*[a-zA-Z0-9])[\w!@#$%^&*()_-]{8,}$/;

    // FIXME: useRef
    const [charging, setCharging] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [username, setUsername] = useState("");

    const errorCheckers = [
        (): boolean => !emailRegex.test(email),
        (): boolean => !usernameRegex.test(username),
        (): boolean => password !== passwordConfirmation || !passwordRegex.test(password),
    ];

    const errorMessages = [
        "Wrong e-mail format",
        "Username should contains at least 4 characters among letters, numbers, '_' and '-'",
        "passwords do not match and/or are not at least 8 characters long",
    ];

    const steps = [
        (
            <>
                <h2 className={`mb-10 text-2xl font-bold`}>
                    Register
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


                <div className={`w-full md:w-[400px] mb-10 flex flex-col items-center gap-5`}>
                    <input required={true} type={`email`} className={`w-1/2 px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={`Email`}
                    onChange={(event) => setEmail(event.target.value)} value={email}/>
                </div>
            </>
        ),
        (
            <>
                <h2 className={`mb-10 text-2xl font-bold`}>
                    Create your username
                </h2>

                <p className={`px-5 py-2 mb-5 text-center`}>
                    #COMPANY_NAME is completely anonymous and all your interactions will be published
                    under your username. Pay attention because you won't be able to change it later.
                </p>

                <div className={`w-full md:w-[400px] mb-10 flex flex-col items-center gap-1`}>
                    <input type={`text`} className={`w-1/2 px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={`Username`}
                    onChange={(event) => setUsername(event.target.value)} value={username}/>
                </div>
            </>
        ),
        (
            <>
                <h2 className={`mb-10 text-2xl font-bold`}>
                    Create your password
                </h2>

                <div className={`w-full md:w-[400px] mb-10 flex flex-col items-center gap-5`}>
                    <input type={`password`} className={`w-1/2 px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={`Password`}
                    onChange={(event) => setPassword(event.target.value)} value={password}/>

                    <input type={`password`} className={`w-1/2 px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={`Repeat password`}
                    onChange={(event) => setPasswordConfirmation(event.target.value)} value={passwordConfirmation}/>
                </div>

                <p className={`px-5 py-2 mb-5 text-center text-sm`}>
                    You acknowledge that you have read and abide by
                    our <span className={`underline text-orange-500 cursor-pointer`}> Terms&nbsp;and&nbsp;Conditions</span>.
                </p>
            </>
        )
    ];

    const buttonClickCallback = async () => {
        if (index === 2) {
            setCharging(true);

            if (errorCheckers[index]()) {
                toast.error(errorMessages[index]);
            }
            else if (!(await isUsernameAvailable(username))) {
                toast.error("Username not available");
            }
            else {
                try {
                    await signUpWithEmail(email, password, username);
                    setCharging(false);
                    hidePopup();
                } catch (error: any) {
                    toast.error(error.message);
                }
            }

            setCharging(false);
        }
        else {
            if (errorCheckers[index]()) {
                toast.error(errorMessages[index]);
                console.log("error");
            }
            else {
                setIndexCallback();
            }
        }
    };

    const getRegisterButtonContent = () => {
        return charging ? "Loading..." : "Register";
    };

    return (
        <div className={`w-full flex flex-col items-center`}>
            <Toaster />
            {steps[index]}

            <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white cursor-pointer ${index !== 2 && "flex items-center gap-3"}`}
            onClick={buttonClickCallback}>
                {index === 2 ? getRegisterButtonContent() : (
                    <>
                        Continue
                        <BsArrowRight />
                    </>
                )}
            </div>

            <div className={`flex gap-1 text-sm`}>
                <p>
                    Already have an account ?
                </p>
                <div className={`text-orange-500 underline cursor-pointer`} onClick={onSwitchAuthType}>
                    Login
                </div>
            </div>
        </div>
    );
}