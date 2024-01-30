export async function generateStaticParams() {
    return { lang: "fr" };
}

export default function HelpPage({ params }: { params: { lang: string }}) {
    return (
        <div>
            HELP
        </div>
    );
}