import type { Metadata } from 'next';
import '../globals.css';
import React from "react";
import {FaBars, FaMagnifyingGlass} from "react-icons/fa6";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Trail Forum',
  description: 'The trail runners community',
};

export default function MainLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang={`en`}>
            <body className={`flex flex-col min-h-screen`}>
                {/*className={`bg-[#0B1416]`}*/}
                {/*Navigaton Bar*/}
                <header className={`fixed top-0 z-50 w-full h-16 px-5 py-3 bg-white border-b-[1px] border-b-gray-200 flex justify-between items-center`}>
                    <div className={`flex items-center gap-2`}>
                        <div className={`text-xl cursor-pointer`}>
                            <FaBars />
                        </div>

                        <h1 className={`mr-10 text-2xl`}>Logo</h1>
                    </div>

                    <div className={`max-md:hidden w-1/2 h-full px-5 bg-gray-100 rounded-full flex items-center gap-2 hover:shadow-sm cursor-pointer`}>
                        <FaMagnifyingGlass />
                        <p>Search</p>
                    </div>

                    <div className={`flex items-center gap-2`}>
                        <div className={`p-3 md:hidden bg-gray-100 rounded-full cursor-pointer`}>
                            <FaMagnifyingGlass />
                        </div>

                        <div className={`max-sm:hidden px-5 py-2 bg-gray-100 rounded-full cursor-pointer hover:shadow-sm`}>
                            Login
                        </div>

                        <Link href={`/auth`}>
                            <div className={`sm:hidden h-full px-5 py-2 bg-orange-500 rounded-full text-white cursor-pointer hover:shadow-md`}>
                                Sign In
                            </div>
                        </Link>

                        <div className={`max-sm:hidden h-full px-5 py-2 bg-orange-500 rounded-full text-white cursor-pointer hover:shadow-md`}>
                            Register
                        </div>
                    </div>
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
