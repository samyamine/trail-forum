
import React from "react";
import Home from "@/components/page_contents/Home";

export async function generateStaticParams() {
    return [{ lang: "fr "}, { lang: "en "}];
}

export default function HomePage({ params }: {params: { lang: string }}) {
    return (
        <Home lang={params.lang} />
    );
}
