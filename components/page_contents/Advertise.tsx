"use client";

import {usePopup} from "@/app/[lang]/popupContext";
import {useEffect, useState} from "react";
import {getDictionary} from "@/lib/dictionary";
import AuthPopup from "@/components/AuthPopup";
import InitAccountPopup from "@/components/InitAccountPopup";

export default function Advertise({ lang }: { lang: string }) {
    const {isAuthPopupVisible, isInitAccountPopupVisible} = usePopup();

    const [dictionary, setDictionary] = useState<any>();

    useEffect(() => {
        if (lang !== "fr" && lang !== "en") {
            throw new Error(`Language ${lang} is not supported`);
        }

        getDictionary(lang).then((dict) => {
            setDictionary(dict);
        });
    }, []);

    return (
        <>
            {isAuthPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {isInitAccountPopupVisible && (
                <InitAccountPopup dictionary={dictionary} />
            )}

            <div className={`px-5 py-3`}>
                ADVERTISE
            </div>
        </>
    );
}