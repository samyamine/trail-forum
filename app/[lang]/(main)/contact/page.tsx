"use client";

import {useEffect, useLayoutEffect, useState} from "react";
import {getDictionary} from "@/lib/dictionary";
import {isUndefined} from "@/lib/utils";
import {usePopup} from "@/app/[lang]/popupContext";
import AuthPopup from "@/components/AuthPopup";
import InitAccountPopup from "@/components/InitAccountPopup";
import Link from "next/link";

export default function ContactPage({ params }: { params: { lang: string }}) {
    const {isAuthPopupVisible, isInitAccountPopupVisible} = usePopup();

    const [dictionary, setDictionary] = useState<any>();

    useEffect(() => {
        console.log(`PARAMS: ${params}`);

        if (params.lang !== "fr" && params.lang !== "en") {
            throw new Error(`Language ${params.lang} is not supported`);
        }

        getDictionary(params.lang).then((dict) => {
            setDictionary(dict);
        });
    }, [dictionary]);

    return (
        <>
            {isAuthPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {isInitAccountPopupVisible && (
                <InitAccountPopup dictionary={dictionary} />
            )}

            {isUndefined(dictionary) ? (
                <div className={"flex justify-center animate-pulse"}>
                    <div className={`md:w-2/3 lg:w-1/2 w-full max-w-[600px] px-5 py-3 mb-10 text-center`}>
                        <div className={`w-full mb-5 flex justify-center`}>
                            <div className={`w-[200px] h-6 py-5 bg-gray-200`}></div>
                        </div>

                        <div className={`flex flex-col gap-6`}>
                            <div className={`w-full h-24 bg-gray-200`}></div>
                            <div className={`w-full h-4 bg-gray-200`}></div>
                            <div className={`w-full h-4 bg-gray-200`}></div>
                            <div className={`w-full h-24 bg-gray-200`}></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={"flex justify-center"}>
                    <div className={`md:w-2/3 lg:w-1/2 w-full max-w-[600px] px-5 py-3 mb-10 text-center`}>
                        <h1 className={`py-5 text-2xl font-bold`}>
                            {dictionary.contact.contact}
                        </h1>

                        <div className={`flex flex-col gap-6`}>
                            <p>
                                {dictionary.contact.text1}
                            </p>

                            <p>
                                {dictionary.contact.support}&nbsp;
                                <span className={`text-orange-500 underline cursor-pointer`}>
                                    <Link href={`mailto:support@zonetrail.com`}>
                                        support@zonetrail.com
                                    </Link>
                                </span>
                            </p>

                            <p>
                                {dictionary.contact.questions}&nbsp;
                                <span className={`text-orange-500 underline cursor-pointer`}>
                                    <Link href={`mailto:questions@zonetrail.com`}>
                                        questions@zonetrail.com
                                    </Link>
                                </span>
                            </p>

                            <p>
                                {dictionary.contact.suggestions}&nbsp;
                                <span className={`text-orange-500 underline cursor-pointer`}>
                                    <Link href={`mailto:suggestions@zonetrail.com`}>
                                        suggestions@zonetrail.com
                                    </Link>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}