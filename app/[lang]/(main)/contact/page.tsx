"use client";

import {useEffect, useLayoutEffect, useState} from "react";
import {getDictionary} from "@/lib/dictionary";
import {isUndefined} from "@/lib/utils";

export default function ContactPage({ params }: { params: { lang: string }}) {
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

    return isUndefined(dictionary) ? (
        <div>
            Loading...
        </div>
        ) : (
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
    );
}