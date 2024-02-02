"use client";

import {usePopup} from "@/app/[lang]/popupContext";
import {useEffect, useState} from "react";
import {getDictionary} from "@/lib/dictionary";
import {isUndefined} from "@/lib/utils";
import AuthPopup from "@/components/AuthPopup";
import InitAccountPopup from "@/components/InitAccountPopup";
import Link from "next/link";

export default function Terms({ params }: { params: {lang: string } }) {
    const {isAuthPopupVisible, isInitAccountPopupVisible} = usePopup();

    const [dictionary, setDictionary] = useState<any>();

    useEffect(() => {
        if (params.lang !== "fr" && params.lang !== "en") {
            throw new Error(`Language ${params.lang} is not supported`);
        }

        getDictionary(params.lang).then((dict) => {
            setDictionary(dict);
        });
    }, [dictionary]);

    return isUndefined(dictionary) ? (
        <div>
            Loading...
        </div>
    ) : (
        <>
            {isAuthPopupVisible && (
                <AuthPopup dictionary={dictionary} />
            )}

            {isInitAccountPopupVisible && (
                <InitAccountPopup dictionary={dictionary} />
            )}

            <div className={"flex justify-center"}>
                <div className={`md:w-2/3 lg:w-1/2 w-full max-w-[600px] px-5 py-3 mb-10 flex flex-col gap-10 text-justify`}>
                    <div>
                        <h1 className={`py-5 text-2xl font-bold text-center`}>
                            Terms of Use
                        </h1>

                        <p>
                            Welcome to Zone Trail! By accessing or using our platform,
                            you agree to comply with and be bound by the following
                            terms and conditions of use. If you do not agree with
                            these terms, please do not use our services.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            1. Acceptance of Terms
                        </h2>

                        <p>
                            By using Zone Trail, you acknowledge that you have read,
                            understood, and agree to be bound by these Terms of Use.
                            These terms may be updated or modified from time to time
                            without notice, and it is your responsibility to review
                            them periodically.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            2. User Conduct
                        </h2>

                        <ul className={`pl-5 list-disc`}>
                            <li>
                                Users must be at least 13 years old to register and use the platform.
                            </li>

                            <li>
                                Users are responsible for maintaining the confidentiality of their account information and passwords.
                            </li>

                            <li>
                                Users agree not to engage in any activity that disrupts or interferes with the proper functioning of the forum.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            3. Content Guidelines
                        </h2>

                        <ul className={`pl-5 list-disc`}>
                            <li>
                                Users are solely responsible for the content they post on the platform.
                            </li>

                            <li>
                                Prohibited content includes but is not limited to: illegal, defamatory, obscene, offensive, or harmful material.
                            </li>

                            <li>
                                Zone Trail reserves the right to remove any content that violates these guidelines without notice.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            4. Privacy and Data Security
                        </h2>

                        <p>
                            Zone Trail is committed to protecting user privacy.
                            Please review our Privacy Policy to understand how your
                            information is collected, used, and shared.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            5. Intellectual Property
                        </h2>

                        <ul className={`pl-5 list-disc`}>
                            <li>
                                Users retain ownership of the content they post but grant Zone Trail a non-exclusive, royalty-free license to use, reproduce, and distribute the content.
                            </li>

                            <li>
                                Users may not infringe on the intellectual property rights of others while using the platform.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            6. Termination
                        </h2>

                        <p>
                            Zone Trail reserves the right to terminate or suspend
                            user accounts at its discretion for violations of
                            these terms.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            7. Disclaimer of Warranties
                        </h2>

                        <p>
                            Zone Trail provides its services on an "as-is" and
                            "as-available" basis. We make no warranties,
                            expressed or implied, regarding the reliability,
                            accuracy, or availability of the platform.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            8. Limitation of Liability
                        </h2>

                        <p>
                            Zone Trail shall not be liable for any direct,
                            indirect, incidental, special, or consequential
                            damages arising out of or in any way connected with
                            the use of our platform.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            9. Governing Law
                        </h2>

                        <p>
                            These Terms of Use shall be governed by and construed
                            in accordance with the laws of France.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            Contact Information:
                        </h2>

                        <p>
                            If you have any questions or concerns about these terms,
                            please contact us at&nbsp;
                            <span className={`text-orange-500 underline cursor-pointer`}>
                                <Link href={`mailto:questions@zonetrail.com`}>
                                    questions@zonetrail.com
                                </Link>
                            </span>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}