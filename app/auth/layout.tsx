import React from "react";
import {FaBars, FaMagnifyingGlass} from "react-icons/fa6";
import Link from "next/link";

export const metadata = {
  title: 'Sign in',
  description: 'Sign in or create an account',
}

export default function SignInLayout({children}: { children: React.ReactNode} ) {
    return (
        <html lang={`en`}>
            <body className={`flex flex-col min-h-screen`}>
                {/*className={`bg-[#0B1416]`}*/}
                {/*Navigaton Bar*/}
                <header className={`fixed top-0 z-50 w-full h-16 py-3 bg-white flex justify-center`}>
                    <h1 className={`text-2xl`}>
                        Logo
                    </h1>
                </header>

                <main className={`flex-grow`}>
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
                </footer>
            </body>
        </html>
    );
}
