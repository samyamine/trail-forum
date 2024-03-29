"use client";

import React, {useEffect, useRef, useState} from "react";
import AuthPopup from "@/components/AuthPopup";
import {usePopup} from "@/app/[lang]/popupContext";
import {useAuth} from "@/app/[lang]/authContext";
import toast from "react-hot-toast";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    serverTimestamp,
    updateDoc
} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {useRouter} from "next/navigation";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import {ECategoryType} from "@/lib/enums";
import InitAccountPopup from "@/components/InitAccountPopup";
import {getDictionary} from "@/lib/dictionary";
import {isUndefined} from "@/lib/utils";
import SharePopup from "@/components/SharePopup";

export default function NewTopicPage({ params }: { params: { lang: string }}) {
    const {isAuthPopupVisible, showAuthPopup, isInitAccountPopupVisible, isSharePopupVisible} = usePopup();
    const {user, userData} = useAuth();
    const router = useRouter();

    const categoryRef = useRef<HTMLDivElement>(null);

    const SUBJECT_MAX_LENGTH = 200;
    const BODY_MAX_LENGTH = 1500;

    const [dictionary, setDictionary] = useState<any>();
    const [charging, setCharging] = useState(false);
    const [showCategoryOptions, setShowCategoryOptions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>(ECategoryType.Discussion);
    const [subject, setSubject] = useState("");
    const [subjectTooLong, setSubjectTooLong] = useState(false);
    const [body, setBody] = useState("");
    const [bodyTooLong, setBodyTooLong] = useState(false);

    const setNewSubject = (text: string) => {
        if (text.length <= SUBJECT_MAX_LENGTH) {
            setSubject(text);

            if (subjectTooLong) {
                setSubjectTooLong(false);
            }
        }
        else {
            setSubjectTooLong(true);
        }
    };

    const setNewBody = (text: string) => {
        if (text.length <= BODY_MAX_LENGTH) {
            setBody(text);

            if (bodyTooLong) {
                setBodyTooLong(false);
            }
        }
        else {
            setBodyTooLong(true);
        }
    };

    const createTopic = async () => {
        if (user === null) {
            showAuthPopup();
        }
        else {
            try {
                setCharging(true);
                const authorRef = doc(db, "users", user.uid);

                const topicRef = await addDoc(collection(db, "topics"), {
                    author: authorRef,
                    body,
                    category: selectedCategory,
                    comments: [],
                    country: userData?.country,
                    creationDate: serverTimestamp(),
                    title: subject,
                    upVoted: [],
                    downVoted: [],
                });

                await updateDoc(authorRef, {
                    topics: arrayUnion(topicRef),
                });

                setCharging(false);
                router.push(`/topic/${topicRef.id}`);
                toast.success("Topic created");
            } catch (error: any) {
                toast.error(error.message);
                setCharging(false);
            }
        }
    };

    useEffect(() => {
        const handleClickOutsideCategory = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategoryOptions(false);
            }
        };

        window.addEventListener('click', handleClickOutsideCategory);

        if (params.lang !== "fr" && params.lang !== "en") {
            throw new Error(`Language ${params.lang} is not supported`);
        }

        getDictionary(params.lang).then((dict) => {
            setDictionary(dict);
        });

        return () => {
            window.removeEventListener('click', handleClickOutsideCategory);
        };
    }, []);

    return isUndefined(dictionary) ? (
        <div>
            Loading...
        </div>
        ) : (
        <div className={`flex justify-center`}>
            {/*Signin popup*/}
            {isAuthPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {/*Google auth set username popup*/}
            {isInitAccountPopupVisible && (
                <InitAccountPopup dictionary={dictionary} />
            )}

            {isSharePopupVisible && (
                <SharePopup dictionary={dictionary} />
            )}
            
            <div className={`relative md:w-2/3 lg:w-1/2 w-full max-w-[600px] px-5 py-5 flex flex-col gap-5`}>
                <h1 className={`w-full text-2xl font-bold`}>
                    {dictionary.newTopic.title}
                </h1>

                <div>
                    <div className={`w-full mb-2 flex justify-between items-center`}>
                        <h3 className={`text-md`}>
                            {dictionary.newTopic.subject}
                        </h3>
                        <p className={`text-xs`}>{SUBJECT_MAX_LENGTH - subject.length}</p>
                    </div>
                    <input id={`subject`} type={`text`} className={`w-full px-4 py-2 ${subjectTooLong ? "bg-red-200" : "bg-gray-100"} 
                    rounded-lg border-[1px] ${subjectTooLong ? "border-red-400" : "border-gray-400"} text-sm placeholder-gray-400`}
                    placeholder={dictionary.newTopic.subjectPlaceholder} value={subject}
                    onChange={(event) => setNewSubject(event.target.value)}/>
                </div>

                <div className={`flex gap-3 items-center`}>
                    <h3 className={`text-md`}>
                        {dictionary.newTopic.category}
                    </h3>

                    {/*Category Selector*/}
                    <div ref={categoryRef} className={`relative flex items-center gap-1 cursor-pointer text-sm`}
                    onClick={() => setShowCategoryOptions(!showCategoryOptions)}>
                        <div className={`px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-100 active:bg-gray-200 
                        flex items-center gap-1`}>
                            <p>
                                {dictionary.main.categories[selectedCategory]}
                            </p>

                            <div className={`${!showCategoryOptions && "hidden"}`}>
                                <LiaAngleUpSolid />
                            </div>

                            <div className={`${showCategoryOptions && "hidden"}`}>
                                <LiaAngleDownSolid />
                            </div>
                        </div>

                        {showCategoryOptions && (
                            <div className={`min-w-max shadow-md bg-white 
                                absolute top-8 left-1/2 -translate-x-1/2 border-[1px] border-black`}>
                                {Object.keys(ECategoryType).slice(1).map((type, index) => (
                                    <p key={index} className={`px-3 py-2 hover:bg-gray-200 active:bg-gray-200`} onClick={() => setSelectedCategory(type)}>
                                        {dictionary.main.categories[type]}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={`flex flex-col items-end gap-2`}>
                    <p className={`text-xs`}>{BODY_MAX_LENGTH - body.length}</p>
                    <textarea className={`w-full p-2 resize-none overflow-y-auto bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400 ${subjectTooLong ? "bg-red-200" : "bg-gray-100"}
                        ${subjectTooLong ? "border-red-400" : "border-gray-400"}`}
                              rows={10} cols={50} placeholder={dictionary.newTopic.questionPlaceholder} value={body}
                            onChange={(event) => setNewBody(event.target.value)}>
                    </textarea>
                </div>


                <p className={`text-sm text-justify`}>
                    {dictionary.newTopic.termsAndConditionCaution} <span className={`underline text-orange-500 cursor-pointer`}> {dictionary.newTopic.termsAndCondition}.</span>
                </p>

                {/*Category*/}
                <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white text-center cursor-pointer`}
                onClick={() => createTopic()}>
                    {charging ? `${dictionary.loading}...` : `${dictionary.newTopic.button}`}
                </div>
            </div>
        </div>
    );
}
