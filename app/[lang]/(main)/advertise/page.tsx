"use client";

import {usePopup} from "@/app/[lang]/popupContext";
import AuthPopup from "@/components/AuthPopup";
import {useEffect, useState} from "react";
import {getDictionary} from "@/lib/dictionary";
import UsernamePopup from "@/components/UsernamePopup";

export default function AdvertisePage({ params }: { params: { lang: string } }) {
    const {isAuthPopupVisible, isUsernamePopupVisible} = usePopup();

    const [dictionary, setDictionary] = useState<any>();

    useEffect(() => {
        if (params.lang !== "fr" && params.lang !== "en") {
            throw new Error(`Language ${params.lang} is not supported`);
        }

        getDictionary(params.lang).then((dict) => {
            setDictionary(dict);
        });
    }, []);

    return (
        <>
            {isAuthPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {isUsernamePopupVisible && (
                <UsernamePopup dictionary={dictionary} />
            )}

            <div className={`px-5 py-3`}>
                ADVERTISE
            </div>
        </>
    );
}