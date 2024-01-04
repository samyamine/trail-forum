"use client";

import {FaBars, FaMagnifyingGlass} from "react-icons/fa6";
import React, {useState} from "react";
import {usePopup} from "@/app/context";

export default function Header() {
    const { isPopupVisible, showPopup, hidePopup } = usePopup();

    return (
        <header className={`fixed top-0 z-10 w-full h-16 px-5 py-3 bg-white border-b-[1px] border-b-gray-200 flex justify-between items-center`}>
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

                <div className={`sm:hidden h-full px-5 py-2 bg-orange-500 rounded-full text-white cursor-pointer hover:shadow-md`}
                     onClick={showPopup}>
                    Sign In
                </div>

                <div className={`max-sm:hidden h-full px-5 py-2 bg-orange-500 rounded-full text-white cursor-pointer hover:shadow-md`}>
                    Register
                </div>
            </div>
        </header>
    );
}