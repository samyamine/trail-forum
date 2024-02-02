
import React from "react";
import Topic from "@/components/page_contents/Topic";
import {collection, getDocs} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";

export async function generateStaticParams() {
    // FIXME: Get all the profile Ids
    const results = [];
    const querySnapshot = await getDocs(collection(db, "topics"));

    for (const snapshot of querySnapshot.docs) {
        results.push({ id: snapshot.id, lang: "fr "}, { id: snapshot.id, lang: "en" });
    }

    return results;
}

export default function TopicPage({ params }: { params: { id: string, lang: string }}) {
    return (
        <Topic lang={params.lang} id={params.id} />
    );
}
