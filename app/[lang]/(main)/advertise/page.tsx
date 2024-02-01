"use client";

import {usePopup} from "@/app/[lang]/popupContext";
import AuthPopup from "@/components/AuthPopup";
import {useEffect, useState} from "react";
import {getDictionary} from "@/lib/dictionary";
import InitAccountPopup from "@/components/InitAccountPopup";

export default function AdvertisePage({ params }: { params: { lang: string } }) {
    const {isAuthPopupVisible, isInitAccountPopupVisible} = usePopup();

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

            {isInitAccountPopupVisible && (
                <InitAccountPopup dictionary={dictionary} />
            )}

            <div className={`px-5 py-3`}>
                ADVERTISE
            </div>
        </>
    );
}