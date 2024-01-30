export async function generateStaticParams() {
    return { lang: "fr" };
}

export default function AdvertisePage({ params }: {params: { lang: string }}) {
    return (
        <div className={`px-5 py-3`}>
            ADVERTISE
        </div>
    );
}