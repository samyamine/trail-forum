"use client";

import {usePopup} from "@/app/[lang]/popupContext";
import {useEffect, useState} from "react";
import {getDictionary} from "@/lib/dictionary";
import {isUndefined} from "@/lib/utils";
import AuthPopup from "@/components/AuthPopup";
import InitAccountPopup from "@/components/InitAccountPopup";
import Link from "next/link";

export default function Privacy({ params }: { params: {lang: string } }) {
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
                            Privacy Policy
                        </h1>

                        <p className={`mb-5 text-xs font-bold`}>
                            Last Updated: 02/02/2024
                        </p>

                        <p>
                            Welcome to [Your Social Media Forum]! We are committed to
                            protecting the privacy and security of your information.
                            This Privacy Policy explains how we collect, use, and
                            safeguard your personal data. By using our platform,
                            you agree to the terms outlined in this policy.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            1. Information We Collect
                        </h2>

                        <p>
                            We may collect the following types of information when
                            you use [Your Social Media Forum]:<br/><br/>
                        </p>

                        <ul className={`pl-5 list-disc`}>
                            <li>
                                <span className={`font-bold`}>Personal Information:</span>
                                Such as your name, email address,
                                and other contact details provided during registration.
                            </li>

                            <li>
                                <span className={`font-bold`}>User Content:</span>
                                Information and content you post, upload,
                                or share on the platform.
                            </li>

                            <li>
                                <span className={`font-bold`}>Device Information:</span>
                                Information about the device you use to access the
                                forum, including IP address, browser type, and device
                                identifiers.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            2. How We Use Your Information
                        </h2>

                        <p>
                            We use the collected information for the following purposes:<br/><br/>
                        </p>

                        <ul className={`pl-5 list-disc`}>
                            <li>
                                To provide and improve our services.
                            </li>

                            <li>
                                To customize and personalize your experience on the platform.
                            </li>

                            <li>
                                To communicate with you regarding your account, updates, and important announcements.
                            </li>

                            <li>
                                To analyze usage patterns and improve the functionality of the forum.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            3. Sharing of Information
                        </h2>

                        <p>
                            We may share your information with third parties under the following circumstances:<br/><br/>
                        </p>

                        <ul className={`pl-5 list-disc`}>
                            <li>
                                With your consent.
                            </li>

                            <li>
                                To comply with legal obligations.
                            </li>

                            <li>
                                To protect our rights and interests.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            4. Data Security
                        </h2>

                        <p>
                            We employ reasonable security measures to protect
                            your information from unauthorized access, disclosure,
                            alteration, and destruction. However, no method of
                            transmission over the internet or electronic storage is
                            completely secure, and we cannot guarantee absolute security.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            5. Your choices
                        </h2>

                        <p>
                            You have the right to:<br/><br/>
                        </p>

                        <ul className={`pl-5 list-disc`}>
                            <li>
                                Access, correct, or delete your personal information.
                            </li>

                            <li>
                                Opt-out of receiving promotional emails.
                            </li>

                            <li>
                                Adjust privacy settings for your account.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            6. Cookies and Tracking Technologies
                        </h2>

                        <p>
                            We may use cookies and similar technologies in the future
                            to enhance your experience and collect information about
                            how you use our platform. You can manage cookie preferences
                            through your browser settings.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            7. Changes to this Privacy Policy
                        </h2>

                        <p>
                            We may update this Privacy Policy periodically to
                            reflect changes in our practices. The updated policy
                            will be posted on our website, and your continued use
                            of the platform constitutes acceptance of the
                            updated terms.
                        </p>
                    </div>

                    <div>
                        <h2 className={`font-bold mb-5`}>
                            Contact Information:
                        </h2>

                        <p>
                            If you have any questions or concerns about this privacy policy,
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