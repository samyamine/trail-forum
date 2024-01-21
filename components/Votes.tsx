"use client";

import {TbArrowBigDown, TbArrowBigUp} from "react-icons/tb";
import {useAuth} from "@/app/authContext";
import {useEffect, useState} from "react";
import {isUndefined} from "@/lib/utils";
import {arrayRemove, arrayUnion, doc, DocumentReference, getDoc, updateDoc} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {usePopup} from "@/app/popupContext";
import toast from "react-hot-toast";

export default function Votes({ initCount, collection, id }: { initCount: number, collection: string, id: string }) {
    const {userData} = useAuth();
    const {showPopup} = usePopup();

    const [votes, setVotes] = useState({ up: false, down: false });
    const [count, setCount] = useState(initCount);

    useEffect(() => {
        setVotes({up: false, down: false});
        if (!isUndefined(userData)) {
            const upVotedTopics = userData?.upVotedTopics as DocumentReference[];
            const upVotedComments = userData?.upVotedComments as DocumentReference[];
            const downVotedTopics = userData?.downVotedTopics as DocumentReference[];
            const downVotedComments = userData?.downVotedComments as DocumentReference[];

            const upVoted = [...upVotedTopics, ...upVotedComments];
            const downVoted = [...downVotedTopics, ...downVotedComments];

            for (const upVote of upVoted) {
                if (upVote.id === id) {
                    setVotes({ up: true, down: false });
                }
            }

            for (const downVote of downVoted) {
                if (downVote.id === id) {
                    setVotes({ up: false, down: true });
                }
            }
        }
    }, [userData]);

    const onUpVote = async () => {
        if (isUndefined(userData)) {
            showPopup();
        }
        else if (votes.up) {
            const userUID = String(userData?.uid);

            const userRef = doc(db, "users", userUID);
            const docRef = doc(db, collection, id);

            await updateDoc(docRef, {
                upVoted: arrayRemove(userRef),
            });

            switch (collection) {
                case "comments":
                    await updateDoc(userRef, {
                        upVotedComments: arrayRemove(docRef),
                    });
                    break;
                case "topics":
                    await updateDoc(userRef, {
                        upVotedTopics: arrayRemove(docRef),
                    });
                    break;
                default:
                    throw new Error(`Unknown collection ${collection}`);
            }

            setCount(count - 1);
            setVotes({ up: false, down: false });
        }
        else {
            const userUID = String(userData?.uid);

            const userRef = doc(db, "users", userUID);
            const docRef = doc(db, collection, id);

            await updateDoc(docRef, {
                upVoted: arrayUnion(userRef),
                downVoted: arrayRemove(userRef),
            });

            switch (collection) {
                case "comments":
                    await updateDoc(userRef, {
                        upVotedComments: arrayUnion(docRef),
                        downVotedComments: arrayRemove(docRef),
                    });
                    break;
                case "topics":
                    await updateDoc(userRef, {
                        upVotedTopics: arrayUnion(docRef),
                        downVotedTopics: arrayRemove(docRef),
                    });
                    break;
                default:
                    throw new Error(`Unknown collection ${collection}`);
            }

            if (votes.down) {
                setCount(count + 2);
            }
            else {
                setCount(count + 1);
            }

            setVotes({ up: true, down: false });
        }
    };

    const onDownVote = async () => {
        if (isUndefined(userData)) {
            showPopup();
        }
        else if (votes.down) {
            const userUID = String(userData?.uid);

            const userRef = doc(db, "users", userUID);
            const docRef = doc(db, collection, id);

            await updateDoc(docRef, {
                downVoted: arrayRemove(userRef),
            });

            switch (collection) {
                case "comments":
                    await updateDoc(userRef, {
                        downVotedComments: arrayRemove(docRef),
                    });
                    break;
                case "topics":
                    await updateDoc(userRef, {
                        downVotedTopics: arrayRemove(docRef),
                    });
                    break;
                default:
                    throw new Error(`Unknown collection ${collection}`);
            }

            setCount(count + 1);
            setVotes({ up: false, down: false });
        }
        else {
            const userUID = String(userData?.uid);

            const userRef = doc(db, "users", userUID);
            const docRef = doc(db, collection, id);

            await updateDoc(docRef, {
                downVoted: arrayUnion(userRef),
                upVoted: arrayRemove(userRef),
            });

            switch (collection) {
                case "comments":
                    await updateDoc(userRef, {
                        downVotedComments: arrayUnion(docRef),
                        upVotedComments: arrayRemove(docRef),
                    });
                    break;
                case "topics":
                    await updateDoc(userRef, {
                        upVotedTopics: arrayRemove(docRef),
                        downVotedTopics: arrayUnion(docRef),
                    });
                    break;
                default:
                    throw new Error(`Unknown collection ${collection}`);
            }

            if (votes.up) {
                setCount(count - 2);
            }
            else {
                setCount(count - 1);
            }

            setVotes({ up: false, down: true });
        }
    };

    return (
        <div className={`rounded-full flex gap-2 items-center border-[1px] border-black text-xs`}>
            <div className={`p-1 rounded-full cursor-pointer hover:bg-gray-300 ${votes.up && "bg-gray-300 text-blue-500"}`}
            onClick={() => onUpVote().catch((error) => toast.error(error.message))}>
                <TbArrowBigUp />
            </div>
            <p>{count}</p>

            <div className={`p-1 rounded-full cursor-pointer hover:bg-gray-300 ${votes.down && "bg-gray-300 text-red-500"}`}
            onClick={() => onDownVote().catch((error) => toast.error(error.message))}>
                <TbArrowBigDown />
            </div>
        </div>
    );
}