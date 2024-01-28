import './globals.css';
import {Metadata} from "next";
import React, {StrictMode} from "react";
import Header from "@/components/Header";
import {Toaster} from "react-hot-toast";
import {AuthProvider} from "@/app/[lang]/authContext";
import {PopupProvider} from "@/app/[lang]/popupContext";

export const metadata: Metadata = {
    title: 'Trail Forum',
    description: 'The trail runners community',
};

export default function RootLayout({children, params}: {children: React.ReactNode, params: {lang: string}} )  {
    return (
        <AuthProvider>
            <PopupProvider>
                <html lang={`en`}>
                <body className={`flex flex-col min-h-screen`}>
                {/*className={`bg-[#0B1416]`}*/}
                <Toaster />
                <Header lang={params.lang} />

                <main className={`mt-16 flex-grow`}>
                    {children}
                </main>

                <footer className={`mt-auto bg-black py-8 text-white flex flex-col justify-center items-center`}>
                    <div className={`py-2 text-center flex flex-col gap-2`}>
                        <p>
                            Contact
                        </p>

                        <p>
                            Advertise with us
                        </p>
                    </div>

                    <h3>
                        The trail runner community
                    </h3>

                    <p>
                        2024 - Zone Trail &copy;
                    </p>
                </footer>
                </body>
                </html>
            </PopupProvider>
        </AuthProvider>
    );
}