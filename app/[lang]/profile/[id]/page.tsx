
import React from "react";
import Profile from "@/components/page_contents/Profile";
import {collection, getDocs} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";

export async function generateStaticParams() {
    // FIXME: Get all the profile Ids
    const results = [];
    const querySnapshot = await getDocs(collection(db, "users"));

    for (const snapshot of querySnapshot.docs) {
        results.push({ id: snapshot.id, lang: "fr "}, { id: snapshot.id, lang: "en" });
    }

    return results;
}

export default function ProfilePage({ params }: { params: { id: string, lang: string }}) {
    return (
        <Profile lang={params.lang} id={params.id} />
    );
}