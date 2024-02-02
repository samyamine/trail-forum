"use client";

import {usePopup} from "@/app/[lang]/popupContext";
import {useEffect, useState} from "react";
import {getDictionary} from "@/lib/dictionary";
import {isUndefined} from "@/lib/utils";
import AuthPopup from "@/components/AuthPopup";
import InitAccountPopup from "@/components/InitAccountPopup";

export default function Contact({ lang }: { lang: string }) {
    const {isAuthPopupVisible, isInitAccountPopupVisible} = usePopup();

    const [dictionary, setDictionary] = useState<any>();

    useEffect(() => {
        if (lang !== "fr" && lang !== "en") {
            throw new Error(`Language ${lang} is not supported`);
        }

        getDictionary(lang).then((dict) => {
            setDictionary(dict);
        });
    }, [dictionary]);

    return isUndefined(dictionary) ? (
        <div>
            Loading...
        </div>
    ) : (
        <>
            {isAuthPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {isInitAccountPopupVisible && (
                <InitAccountPopup dictionary={dictionary} />
            )}

            <div className={`px-5 py-3`}>
                <h1 className={`py-5 text-2xl font-bold`}>
                    {dictionary.contact.contact} Zone Trail
                </h1>

                <div className={`flex flex-col gap-6`}>
                    <p>
                        {dictionary.contact.text1}
                    </p>

                    <p>
                        {dictionary.contact.support} <br/>
                        <span className={`text-orange-500 underline cursor-pointer`}>support@zonetrail.com</span>
                    </p>

                    <p>
                        {dictionary.contact.questions}<br/>
                        <span className={`text-orange-500 underline cursor-pointer`}>questions@zonetrail.com</span>
                    </p>

                    <p>
                        {dictionary.contact.suggestions}&nbsp;
                        <span className={`text-orange-500 underline cursor-pointer`}>suggestions@zonetrail.com</span>
                    </p>
                </div>
            </div>
        </>
    );
}