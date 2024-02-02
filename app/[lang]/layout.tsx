import './globals.css';
import {Metadata} from "next";
import React, {StrictMode} from "react";
import Header from "@/components/Header";
import {Toaster} from "react-hot-toast";
import {AuthProvider} from "@/app/[lang]/authContext";
import {PopupProvider} from "@/app/[lang]/popupContext";
import Footer from "@/components/Footer";

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

                <Footer />
                </body>
                </html>
            </PopupProvider>
        </AuthProvider>
    );
}