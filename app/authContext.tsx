"use client";

import React, {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {
    createUserWithEmailAndPassword, GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword, signInWithPopup,
    signOut,
    User
} from "@firebase/auth";
import {auth, db} from "@/lib/firebase/config";
import {
    doc,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    getDoc,
    onSnapshot,
    setDoc,
    Unsubscribe
} from "@firebase/firestore";
import {IComment, ITopic, IUser} from "@/lib/interfaces";
import {isUndefined} from "@/lib/utils";
import {getComments, getSaved, getTopic} from "@/lib/topic/utils";



interface IAuthContextProps {
    user: User | null,
    userData: IUser | undefined,
    signInWithEmail: (email: string, password: string) => Promise<void>,
    signUpWithEmail: (email: string, password: string, username: string) => Promise<void>,
    googleSignIn: () => Promise<boolean>,
    logOut: () => Promise<void>,
}

interface IAuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<IAuthContextProps | undefined>(undefined);

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<IUser | undefined>(undefined);

    useEffect(() => {
        /* FIXME: Here I should init ALL the data since this useEffect will also be called
         * Each time the page is manually refreshed
         */
        const initData = async (doc: DocumentSnapshot) => {
            console.log(`CURRENT DATA:`);
            console.log(doc.data());

            if (!isUndefined(doc.data())) {
                const data = doc.data() as DocumentData;
                const comments = await getComments(data.comments);
                const saved = await getSaved(data.saved);
                const topics: ITopic[] = [];

                for (const ref of data.topics) {
                    const topic = await getTopic(ref.id);
                    topics.push(topic);
                }

                const newUserData: IUser = {
                    uid: doc.id,
                    comments,
                    downVotedComments: data.downVotedComments,
                    downVotedTopics: data.downVotedTopics,
                    topics,
                    upVotedComments: data.upVotedComments,
                    upVotedTopics: data.upVotedTopics,
                    username: data.username,
                    saved,
                };

                setUserData(newUserData);
            }
        };

        let unsubscribeUserData: Unsubscribe | null = null;

        if (user !== null) {
            unsubscribeUserData = onSnapshot(doc(db, "users", user.uid), (doc) => {
                initData(doc).catch((error) => console.log(error.message));
            });
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => {
            unsubscribe();
            if (unsubscribeUserData !== null) {
                unsubscribeUserData();
            }
        }
    }, [user]);

    const getUserData = async (uid: string) => {
        const docRef = doc(db, "users", uid);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
            throw new Error("The specified user does not exit anymore");
        }

        console.log("USER DATA:");
        console.log(docSnapshot.data());

        if (!isUndefined(docSnapshot.data())) {
            const data = docSnapshot.data() as DocumentData;

            const newUserData = {
                uid: docSnapshot.id,
                comments: data.comments,
                downVotedComments: data.downVotedComments,
                downVotedTopics: data.downVotedTopics,
                topics: data.topics,
                upVotedComments: data.upVotedComments,
                upVotedTopics: data.upVotedTopics,
                username: data.username,
                saved: data.saved,
            };

            setUserData(newUserData);
        }
        else {
            setUserData(undefined);
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        const credentials = await signInWithEmailAndPassword(auth, email, password);

        // FIXME: Retrieve database entry for user
        await getUserData(credentials.user.uid);
    };

    const signUpWithEmail = async (email: string, password: string, username: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // FIXME
        await setDoc(doc(db, "users", userCredential.user.uid), {username});
    };

    const logOut = async () => signOut(auth);

    const googleSignIn = async (): Promise<boolean> => {
        console.log("googleSignIn")
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
            console.log("AUTH HEY");
            await setDoc(doc(db, "users", userCredential.user.uid), {
                answers: [],
                comments: [],
                downVotedComments: [],
                downVotedTopics: [],
                saved: [],
                topics: [],
                upVotedComments: [],
                upVotedTopics: [],
                // FIXME
                username: "funny-generated-username",
            });

            return true;
        }

        await getUserData(userCredential.user.uid);

        return false;
    };

    // const addUserToDatabase = async (username: string) => {
    //     // FIXME
    //     await setDoc(doc(db, "users", userCredential.user.uid), {
    //         answers: [],
    //         comments: [],
    //         downVotedComments: [],
    //         downVotedTopics: [],
    //         saved: [],
    //         topics: [],
    //         upVotedComments: [],
    //         upVotedTopics: [],
    //         // FIXME: get username
    //         username: userCredential.user.
    //     });
    // };

    return (
        <AuthContext.Provider value={{ user, userData, signInWithEmail, signUpWithEmail, googleSignIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
