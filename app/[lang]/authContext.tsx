"use client";

import React, {createContext, FC, ReactNode, useContext, useEffect, useLayoutEffect, useState} from "react";
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
    DocumentSnapshot,
    getDoc,
    onSnapshot,
    setDoc,
    Unsubscribe
} from "@firebase/firestore";
import {ITopic, IUser} from "@/lib/interfaces";
import {isUndefined} from "@/lib/utils";
import {getComments, getSaved, getTopic} from "@/lib/topic/utils";
import {allGeneratedPositionsFor} from "@jridgewell/trace-mapping";
import toast from "react-hot-toast";

interface IAuthContextProps {
    loading: boolean,
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
    const [userData, setUserData] = useState<IUser>();
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        console.log("useEffect Auth")
        const initData = async (snapshot: DocumentSnapshot) => {
            if (!isUndefined(snapshot.data())) {
                const data = snapshot.data() as DocumentData;
                const comments = await getComments(data.comments);
                const saved = await getSaved(data.saved);
                const topics: ITopic[] = [];

                for (const ref of data.topics) {
                    const topic = await getTopic(ref.id);
                    topics.push(topic);
                }

                const newUserData: IUser = {
                    uid: snapshot.id,
                    comments,
                    downVotedComments: data.downVotedComments,
                    downVotedTopics: data.downVotedTopics,
                    topics,
                    upVotedComments: data.upVotedComments,
                    upVotedTopics: data.upVotedTopics,
                    username: data.username,
                    saved,
                    followers: data.followers,
                    following: data.following,
                };

                setUserData(newUserData);
                console.log(`NEW USER DATA:`);
                console.log(newUserData);
            }
        };

        const handleUserProfile = async (currentUser: User) => {
            const userRef = doc(db, "users", currentUser.uid);
            const snapshot = await getDoc(userRef);

            return snapshot.exists() ? userRef : null;
        };

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("AUTH CHANGED")
            if (currentUser) {
                const userRef = await handleUserProfile(currentUser);
                if (userRef === null) {
                    // FIXME: improve flow
                    toast.error("Specified user does not exist in database");
                    await signOut(auth);
                    window.location.reload();
                }
                else {
                    onSnapshot(userRef, (snapshot) => {
                        console.log("SNAPSHOT");
                        initData(snapshot).catch((error) => console.log(error.message));
                    });
                }
            }

            if (currentUser === null) {
                console.log("setUserData to undefined");
                setUserData(undefined);
            }

            console.log("setUser");

            setUser(currentUser);
            setLoading(false);
        });

        console.log("RETURN");
        return () => unsubscribe();
    }, []);

    console.log("Outside userData");
    console.log(userData);

    const signInWithEmail = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);



        // // FIXME: Retrieve database entry for user
        // await getUserData(credentials.user.uid);
    };

    // FIXME: TEST UNDEFINED UID AFTER Signing up
    const signUpWithEmail = async (email: string, password: string, username: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", userCredential.user.uid), {
            answers: [],
            comments: [],
            downVotedComments: [],
            downVotedTopics: [],
            saved: [],
            topics: [],
            upVotedComments: [],
            upVotedTopics: [],
            username,
            followers: [],
            following: [],
        });
    };

    const logOut = async () => signOut(auth);

    const googleSignIn = async (): Promise<boolean> => {
        console.log("googleSignIn")
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
            console.log("NOT EXISTING")
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
                followers: [],
                following: [],
            });

            return true;
        }

        console.log("EXISTING")
        return false;
    };

    return (
        <AuthContext.Provider value={{ loading, user, userData, signInWithEmail, signUpWithEmail, googleSignIn, logOut }}>
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
