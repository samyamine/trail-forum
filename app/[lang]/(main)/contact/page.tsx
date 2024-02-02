
import Contact from "@/components/page_contents/Contact";

export async function generateStaticParams() {
    return [{ lang: "fr "}, { lang: "en "}];
}

export default function ContactPage({ params }: { params: { lang: string }}) {
    return (
        <Contact lang={params.lang} />
    );
}