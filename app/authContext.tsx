"use client";

import React, {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User
} from "@firebase/auth";
import {auth, db} from "@/lib/firebase/config";
import {doc, DocumentData, getDoc, onSnapshot, setDoc, Unsubscribe} from "@firebase/firestore";
import {unsubscribe} from "diagnostics_channel";
import {log} from "util";

interface IAuthContextProps {
    user: User | null;
    userData: DocumentData | undefined;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, username: string) => Promise<void>;
    logOut: () => Promise<void>;
}

interface IAuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<IAuthContextProps | undefined>(undefined);

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<DocumentData | undefined>(undefined);

    useEffect(() => {
        let unsubscribeUserData: Unsubscribe | null = null;

        if (user !== null) {
            unsubscribeUserData = onSnapshot(doc(db, "users", user.uid), (doc) => {
                console.log(`CURRENT DATA:`);
                console.log(doc.data());
                setUserData(doc.data());
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

        setUserData(docSnapshot.data());
    };

    const signInWithEmail = async (email: string, password: string) => {
        const credentials = await signInWithEmailAndPassword(auth, email, password);

        // FIXME: Retrieve database entry for user
        await getUserData(credentials.user.uid);
    };

    const signUpWithEmail = async (email: string, password: string, username: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", userCredential.user.uid), {username});
    };

    const logOut = async () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, userData, signInWithEmail, signUpWithEmail, logOut }}>
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
