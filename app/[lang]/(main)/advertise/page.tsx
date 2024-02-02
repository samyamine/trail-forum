
import Advertise from "@/components/page_contents/Advertise";

export async function generateStaticParams() {
    return [{ lang: "fr "}, { lang: "en "}];
}

export default function AdvertisePage({ params }: { params: { lang: string } }) {
    return (
        <Advertise lang={params.lang} />
    );
}