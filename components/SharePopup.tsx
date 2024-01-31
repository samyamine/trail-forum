import {Toaster} from "react-hot-toast";
import React from "react";
import {usePopup} from "@/app/[lang]/popupContext";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterIcon,
    TwitterShareButton
} from "next-share";
import {usePathname} from "next/navigation";

export default function SharePopup({ dictionary }: { dictionary: any }) {
    const {hideSharePopup, sharePopupID} = usePopup();

    const pathname = usePathname();
    console.log(`http://localhost:3000${pathname}/${sharePopupID}`)

    return (
        <div className={`w-full h-full fixed top-16 z-50 flex justify-center items-center`}>
            <div className={`w-full h-full bg-black opacity-60`} onClick={hideSharePopup}></div>

            <div className={`p-3 bg-white absolute flex flex-col justify-center items-center`}>
                <h2 className={`mb-3 text-2xl font-bold`}>
                    {dictionary.share}
                </h2>

                <div className={`flex justify-center gap-2`}>
                    <FacebookShareButton url={`http://localhost:3000${pathname}/${sharePopupID}`}>
                        <FacebookIcon round size={32} />
                    </FacebookShareButton>

                    <TwitterShareButton url={`http://localhost:3000${pathname}/${sharePopupID}`}>
                        <TwitterIcon round size={32} />
                    </TwitterShareButton>

                    <RedditShareButton url={`http://localhost:3000${pathname}/${sharePopupID}`}>
                        <RedditIcon round size={32} />
                    </RedditShareButton>

                    <EmailShareButton url={`http://localhost:3000${pathname}/${sharePopupID}`}>
                        <EmailIcon round size={32} />
                    </EmailShareButton>
                </div>
            </div>
        </div>
    );
}