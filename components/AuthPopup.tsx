"use client";

import {usePopup} from "@/app/popupContext";
import React, {useState} from "react";
import {TfiClose} from "react-icons/tfi";
import {FcGoogle} from "react-icons/fc";
import RegisterPopup from "@/components/RegisterPopup";
import SignInPopup from "@/components/SignInPopup";
import {BsArrowLeft} from "react-icons/bs";

// FIXME: register flow check if username already taken

export default function AuthPopup() {
    const { hidePopup } = usePopup();
    const [isRegister, setRegister] = useState(false);
    const [index, setIndex] = useState(0);

    return (
        <div className={`w-full h-full bg-white fixed top-0 z-50 flex flex-col items-center`}>
            <div className={`w-full px-5 py-3 mb-24 flex ${index > 0 ? "justify-between" : "justify-end"} text-xl`}>
                {index > 0 && (
                    <div className={`p-2 rounded-full cursor-pointer`} onClick={() => setIndex(index - 1)}>
                        <BsArrowLeft />
                    </div>
                )}

                <div className={`p-2 rounded-full cursor-pointer`} onClick={() => {
                    setRegister(false);
                    hidePopup();
                }}>
                    <TfiClose />
                </div>
            </div>

            {isRegister ? (
                <RegisterPopup index={index} setIndexCallback={() => setIndex(index + 1)} onSwitchAuthType={() => {
                    setIndex(0);
                    setRegister(false);
                }} />
            ) : (
                <SignInPopup onClickCallback={() => setRegister(true)} />
            )}
        </div>
    );
}