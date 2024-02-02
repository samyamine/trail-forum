
import React from "react";
import NewTopic from "@/components/page_contents/NewTopic";

export async function generateStaticParams() {
    return [{ lang: "fr "}, { lang: "en "}];
}

export default function NewTopicPage({ params }: { params: { lang: string }}) {
    return (
        <NewTopic lang={params.lang} />
    );
}
