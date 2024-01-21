"use client";

import {FaBars, FaMagnifyingGlass} from "react-icons/fa6";
import React, {useEffect, useRef, useState} from "react";
import {usePopup} from "@/app/popupContext";
import Link from "next/link";
import {TfiClose} from "react-icons/tfi";
import {AiOutlineMenu} from "react-icons/ai";
import {FaRegUser} from "react-icons/fa";
import {useAuth} from "@/app/authContext";
import {GoSignOut} from "react-icons/go";
import {signOut} from "@firebase/auth";
import {auth} from "@/lib/firebase/config";
import {useRouter} from "next/navigation";

export default function Header() {
    const router = useRouter();
    const { showPopup } = usePopup();
    const { user, userData, logOut } = useAuth();

    const [showDrawer, setShowDrawer] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showProfileActions, setShowProfileActions] = useState(false);

    const showSearchRef = useRef(showSearch);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const disabledSearchRef = useRef<HTMLInputElement | null>(null);

    const handleLogOut = async () => {
        await logOut();
        router.push("/");
        // window.location.reload();
    };

    useEffect(() => {
        console.log("HEADER useEffect");
        console.log(user);

        showSearchRef.current = showSearch;
        if (showSearch && inputRef.current !== null) {
            inputRef.current.focus();
        }
    }, [showSearch]);

    console.log("HEADER init");
    console.log(user);

    return (
        <header className={`fixed top-0 z-10 w-full h-16 px-5 py-3 bg-white border-b-[1px] border-b-gray-200 flex justify-between items-center`}>
            <div className={`w-fit flex items-center gap-2`}>
                <div className={`text-xl cursor-pointer`} onClick={() => setShowDrawer(!showDrawer)}>
                    {showDrawer ? (<TfiClose />) : (<AiOutlineMenu />)}
                </div>

                <Link href={`/`}>
                    <h1 className={`mx-5 text-2xl cursor-pointer`}>
                        Logo
                    </h1>
                </Link>
            </div>

            <div className={`max-md:hidden w-1/2 h-full px-5 ml-2 bg-gray-100 rounded-full flex items-center gap-2 hover:shadow-sm cursor-pointer`}>
                <FaMagnifyingGlass />
                <p>Search</p>
            </div>

            <div className={`flex-grow h-full justify-end flex items-center gap-2`}>
                <div className={`${showSearch && "hidden"} p-3 md:hidden bg-gray-100 rounded-full cursor-pointer`}
                     ref={disabledSearchRef}
                     onClick={() => setShowSearch(true)}>
                    <FaMagnifyingGlass />
                </div>

                <div className={`${!showSearch && "hidden"} md:hidden flex-grow h-full px-5 bg-gray-100 rounded-full
                        flex items-center gap-2 hover:shadow-sm cursor-pointer`}>
                    <FaMagnifyingGlass />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search"
                        className="w-full ml-2 bg-transparent border-none outline-none"/>
                </div>

                <div className={`max-sm:hidden px-5 py-2 bg-gray-100 rounded-full cursor-pointer hover:shadow-sm`}>
                    Login
                </div>

                {user !== null ? (
                    <div className={`relative sm:hidden w-10 h-10 bg-white rounded-full
                     flex justify-center items-center border-[1px] border-black cursor-pointer hover:shadow-md`}
                         onClick={() => setShowProfileActions(!showProfileActions)}>
                        <FaRegUser />

                        {showProfileActions && (
                            <div className={`min-w-max absolute top-12 right-0 shadow-md bg-white
                            border-[1px] border-black text-xs`}>
                                {/*FIXME*/}
                                <Link href={`/profile/bgVKtsOrYzNhMTUiJtfuY0Myqkk2`} className={`px-3 py-2 flex gap-3 items-center hover:bg-gray-200 active:bg-gray-200`}>
                                    <FaRegUser />
                                    <p>
                                        Profile
                                    </p>
                                </Link>

                                <div className={`px-3 py-2 flex gap-3 items-center text-red-400 hover:bg-red-200 active:bg-red-200`}
                                onClick={handleLogOut}>
                                    <GoSignOut />
                                    <p>
                                        Logout
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`sm:hidden whitespace-nowrap h-full px-5 py-2 bg-orange-500 rounded-full text-white cursor-pointer hover:shadow-md`}
                         onClick={showPopup}>
                        Sign In
                    </div>
                )}


                <div className={`max-sm:hidden h-full px-5 py-2 bg-orange-500 rounded-full text-white cursor-pointer hover:shadow-md`}>
                    Register
                </div>
            </div>

            {showDrawer && (
                <div className={`w-full h-full fixed top-16 left-0`}>
                    <div className={`w-full h-full bg-black opacity-60`} onClick={() => setShowDrawer(false)}></div>

                    <div className={`w-2/3 h-full p-3 fixed top-16 left-0 bg-white shadow-md flex flex-col gap-5`}>
                        <div className={`w-fit flex flex-col gap-1 text-sm`}>
                            <h3 className={`mb-1 text-lg text-gray-500`}>
                                Social media
                            </h3>
                            <p className={`hover:underline active:underline cursor-pointer`}>
                                Instagram
                            </p>
                            <p className={`hover:underline active:underline cursor-pointer`}>
                                Facebook
                            </p>
                            <p className={`hover:underline active:underline cursor-pointer`}>
                                Twitter
                            </p>
                            <p className={`hover:underline active:underline cursor-pointer`}>
                                TikTok
                            </p>
                        </div>

                        <div className={`w-fit flex flex-col gap-1 text-sm`}>
                            <h3 className={`mb-1 text-lg text-gray-500`}>
                                Resources
                            </h3>
                            <Link href={`/about`} className={`hover:underline active:underline cursor-pointer`}
                            onClick={() => setShowDrawer(false)}>
                                About us
                            </Link>
                            <Link href={`/help`} className={`hover:underline active:underline cursor-pointer`}
                            onClick={() => setShowDrawer(false)}>
                                Help
                            </Link>
                            <Link href={`/contact`} className={`hover:underline active:underline cursor-pointer`}
                            onClick={() => setShowDrawer(false)}>
                                Contact
                            </Link>
                            <Link href={`/advertise`} className={`hover:underline active:underline cursor-pointer`}
                                  onClick={() => setShowDrawer(false)}>
                                Advertise on #COMPANY_NAME
                            </Link>
                        </div>

                    </div>
                </div>
            )}

            {showSearch && (
                <div className={`w-full h-full fixed top-16 left-0`}>
                    <div className={`w-full h-full bg-black opacity-60`} onClick={() => setShowSearch(false)}></div>

                    <div className={`w-full min-h-40 p-3 fixed top-16 left-0 bg-white shadow-md 
                    flex justify-center items-center`}>
                        No result.
                    </div>
                </div>
            )}
        </header>
    );
}