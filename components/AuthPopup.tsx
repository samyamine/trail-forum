"use client";

import {usePopup} from "@/app/[lang]/popupContext";
import React, {useState} from "react";
import {TfiClose} from "react-icons/tfi";
import RegisterPopup from "@/components/RegisterPopup";
import SignInPopup from "@/components/SignInPopup";
import {BsArrowLeft} from "react-icons/bs";
import {EAuthPopup} from "@/lib/enums";

export default function AuthPopup({ dictionary }: { dictionary: any }) {
    const { hideAuthPopup, popupType } = usePopup();
    const [isRegister, setRegister] = useState(popupType === EAuthPopup.Register);
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
                    hideAuthPopup();
                }}>
                    <TfiClose />
                </div>
            </div>

            {isRegister ? (
                <RegisterPopup dictionary={dictionary} index={index} setIndexCallback={() => setIndex(index + 1)} onSwitchAuthType={() => {
                    setIndex(0);
                    setRegister(false);
                }} />
            ) : (
                <SignInPopup dictionary={dictionary} onClickCallback={() => setRegister(true)} />
            )}
        </div>
    );
}