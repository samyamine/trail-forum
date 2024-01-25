"use client";

import React, {useEffect, useRef, useState} from "react";
import AuthPopup from "@/components/AuthPopup";
import {usePopup} from "@/app/popupContext";
import {useAuth} from "@/app/authContext";
import toast from "react-hot-toast";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    DocumentReference,
    serverTimestamp,
    Timestamp,
    updateDoc
} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {useRouter} from "next/navigation";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import {ECategoryType} from "@/lib/enums";

export default function NewTopicPage() {
    const {isPopupVisible, showPopup} = usePopup();
    const {user} = useAuth();
    const router = useRouter();

    const categoryRef = useRef<HTMLDivElement>(null);

    const SUBJECT_MAX_LENGTH = 200;
    const BODY_MAX_LENGTH = 1500;

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
            showPopup();
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

        return () => {
            window.removeEventListener('click', handleClickOutsideCategory);
        };
    }, []);

    return (
        <>
            {/*Signin popup*/}
            {isPopupVisible && (
                <AuthPopup />
            )}
            
            <div className={`relative px-5 py-5 flex flex-col gap-5`}>
                <h1 className={`text-2xl font-bold`}>
                    Start a new topic
                </h1>

                <div>
                    <div className={`w-full mb-2 flex justify-between items-center`}>
                        <h3 className={`text-md`}>
                            Subject
                        </h3>
                        <p className={`text-xs`}>{SUBJECT_MAX_LENGTH - subject.length}</p>
                    </div>
                    <input id={`subject`} type={`text`} className={`w-full px-4 py-2 ${subjectTooLong ? "bg-red-200" : "bg-gray-100"} 
                    rounded-lg border-[1px] ${subjectTooLong ? "border-red-400" : "border-gray-400"} text-sm placeholder-gray-400`}
                    placeholder={`Any advice to improve my performances ?`} value={subject}
                    onChange={(event) => setNewSubject(event.target.value)}/>
                </div>

                <div className={`flex gap-3 items-center`}>
                    <h3 className={`text-md`}>
                        Category
                    </h3>

                    {/*Category Selector*/}
                    <div ref={categoryRef} className={`relative flex items-center gap-1 cursor-pointer text-sm`}
                    onClick={() => setShowCategoryOptions(!showCategoryOptions)}>
                        <div className={`px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-100 active:bg-gray-200 
                        flex items-center gap-1`}>
                            <p>
                                {selectedCategory}
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
                                {Object.keys(ECategoryType).map((type, index) => (
                                    <p key={index} className={`px-3 py-2 hover:bg-gray-200 active:bg-gray-200`} onClick={() => setSelectedCategory(type)}>
                                        {type}
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
                              rows={10} cols={50} placeholder={`Write your questions here...`} value={body}
                            onChange={(event) => setNewBody(event.target.value)}>
                    </textarea>
                </div>


                <p className={`text-sm text-justify`}>
                    By posting, you acknowledge that you have read and abide by
                    our <span className={`underline text-orange-500 cursor-pointer`}> Terms and Conditions.</span>
                </p>

                {/*Category*/}
                <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white text-center cursor-pointer`}
                onClick={() => createTopic()}>
                    {charging ? "Loading..." : "Create topic"}
                </div>
            </div>
        </>
    );
}
