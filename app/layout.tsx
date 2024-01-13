import './globals.css';
import {Metadata} from "next";
import React from "react";
import {PopupProvider, usePopup} from "@/app/popupContext";
import Header from "@/components/Header";
import {AuthProvider} from "@/app/authContext";

export const metadata: Metadata = {
    title: 'Trail Forum',
    description: 'The trail runners community',
};

export default function RootLayout({children}: { children: React.ReactNode} )  {
    return (
        <AuthProvider>
            <PopupProvider>
                <html lang={`en`}>
                <body className={`flex flex-col min-h-screen`}>
                className={`bg-[#0B1416]`}

                <Header />

                <main className={`mt-10 flex-grow`}>
                    {children}
                </main>

                <footer className={`mt-auto bg-black py-8 text-white flex flex-col items-center`}>
                    <h2>
                        MENU
                    </h2>

                    <h3>
                        The trail addicted community
                    </h3>
                    <p>
                        2024 - LOGO &copy;
                    </p>

                    <p>
                        Qui sommes nous
                        Aide
                        Instagram
                    </p>
                </footer>
                </body>
                </html>
            </PopupProvider>
        </AuthProvider>
    );
}