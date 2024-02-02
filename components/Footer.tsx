import React from "react";
import Link from "next/link";

export default function Footer({ lang }: { lang: string }) {
    return (
        <footer className={`mt-auto bg-black py-8 text-white flex flex-col justify-center items-center`}>
            <div className={`pb-8 text-center flex flex-col gap-1`}>
                {/*<Link href={`/contact`}>*/}
                {/*    Contact*/}
                {/*</Link>*/}

                {/*<Link href={`/advertise`}>*/}
                {/*    Advertise with us*/}
                {/*</Link>*/}

                <Link href={`/privacy`} className={`hover:underline cursor-pointer`}>
                    Privacy policy
                </Link>

                <Link href={`/terms`} className={`hover:underline cursor-pointer`}>
                    Terms of use
                </Link>
            </div>

            <div className={`text-center flex flex-col gap-1`}>
                <h3>
                    The trail runner community
                </h3>

                <p>
                    2024 - ZoneTrail &copy;
                </p>
            </div>

        </footer>
    );
}