"use client";

import {
    FaEarthAfrica,
    FaEarthAmericas,
    FaEarthAsia,
    FaEarthEurope,
    FaEarthOceania,
    FaMagnifyingGlass,
    FaMedal
} from "react-icons/fa6";
import React, {useEffect, useRef, useState} from "react";
import {usePopup} from "@/app/popupContext";
import Link from "next/link";
import {TfiClose} from "react-icons/tfi";
import {AiOutlineMenu} from "react-icons/ai";
import {FaRegUser} from "react-icons/fa";
import {useAuth} from "@/app/authContext";
import {GoSignOut} from "react-icons/go";
import {useRouter} from "next/navigation";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import {EAfrica, EAsia, EContinent, EEurope, ENorthAmerica, EOceania, ESouthAmerica, ETop} from "@/lib/enums";

export default function Header() {
    const router = useRouter();
    const { showPopup } = usePopup();
    const { user, userData, logOut } = useAuth();

    const profileActionsRef = useRef<HTMLDivElement>(null);

    const [showDrawer, setShowDrawer] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showProfileActions, setShowProfileActions] = useState(false);
    const [showContinent, setShowContinent] = useState<EContinent | null>(null);

    const showSearchRef = useRef(showSearch);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const disabledSearchRef = useRef<HTMLInputElement | null>(null);

    const handleLogOut = async () => {
        await logOut();
        router.push("/");
        // window.location.reload();
    };

    const handleSetShowContinent = (value: EContinent) => {
        if (showContinent === value) {
            setShowContinent(null);
        }
        else {
            setShowContinent(value);
        }
    };

    useEffect(() => {
        showSearchRef.current = showSearch;
        if (showSearch && inputRef.current !== null) {
            inputRef.current.focus();
        }
    }, [showSearch]);

    useEffect(() => {
        const handleClickOutsideOptions = (event: MouseEvent) => {
            if (profileActionsRef.current && !profileActionsRef.current.contains(event.target as Node)) {
                setShowProfileActions(false);
            }
        };

        window.addEventListener('click', handleClickOutsideOptions);

        return () => {
            window.removeEventListener('click', handleClickOutsideOptions);
        };
    }, []);

    return (
        <header className={`fixed top-0 z-10 w-full h-16 px-5 py-3 bg-white border-b-[1px] border-b-gray-200 flex justify-between items-center`}>
            <div className={`w-fit flex items-center gap-2`}>
                <div className={`text-xl cursor-pointer`} onClick={() => setShowDrawer(!showDrawer)}>
                    {showDrawer ? (<TfiClose />) : (<AiOutlineMenu />)}
                </div>

                <Link href={`/`} className={`${showSearch && "hidden"}`}>
                    <h1 className={`mx-5 text-2xl cursor-pointer`}>
                        Zone Trail
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

                <div className={`${!showSearch && "hidden"} md:hidden flex-grow h-full px-5 ml-2 bg-gray-100 rounded-full
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
                    <div ref={profileActionsRef} className={`relative sm:hidden w-10 h-10 bg-white rounded-full
                     flex justify-center items-center border-[1px] border-black cursor-pointer hover:shadow-md`}
                         onClick={() => setShowProfileActions(!showProfileActions)}>
                        <FaRegUser />

                        <div className={`${!showProfileActions && "hidden"} min-w-max absolute top-12 right-0 shadow-md bg-white
                        border-[1px] border-black text-xs`}>
                            {/*FIXME*/}
                            <Link href={`/profile/${user.uid}`} className={`px-3 py-2 flex gap-3 items-center hover:bg-gray-200 active:bg-gray-200`}>
                                <FaRegUser />
                                <p>
                                    Profile
                                </p>
                            </Link>

                            <div className={`px-3 py-2 flex gap-3 items-center text-red-500 hover:bg-red-200 active:bg-red-200`}
                            onClick={handleLogOut}>
                                <GoSignOut />
                                <p>
                                    Logout
                                </p>
                            </div>
                        </div>
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

                    <div className={`w-2/3 h-full p-3 fixed top-16 left-0 overflow-y-auto bg-white shadow-md flex flex-col gap-5`}>
                        <div className={`flex flex-col gap-2 text-sm`}>
                            <h3 className={`mb-1 text-lg text-gray-500`}>
                                Location
                            </h3>

                            <div className={`cursor-pointer flex justify-between items-center`}
                            onClick={() => handleSetShowContinent(EContinent.Top)}>
                                <div className={`flex gap-2 items-center`}>
                                    <FaMedal />
                                    <p className={`font-bold`}>
                                        Top 10
                                    </p>
                                </div>

                                {showContinent === EContinent.Top ? (
                                    <LiaAngleUpSolid />
                                ) : (
                                    <LiaAngleDownSolid />
                                )}
                            </div>

                            {showContinent === EContinent.Top && (
                                <div>
                                    {Object.values(ETop).map((value, index) => (
                                        <p key={index} className={`hover:underline active:underline cursor-pointer`}
                                        onClick={() => alert("FIXME")}>
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className={`cursor-pointer flex justify-between items-center`}
                                 onClick={() => handleSetShowContinent(EContinent.Europe)}>
                                <div className={`flex gap-2 items-center`}>
                                    <FaEarthEurope />
                                    <p className={`font-bold`}>
                                        Europe
                                    </p>
                                </div>

                                {showContinent === EContinent.Europe ? (
                                    <LiaAngleUpSolid />
                                ) : (
                                    <LiaAngleDownSolid />
                                )}
                            </div>

                            {showContinent === EContinent.Europe && (
                                <div>
                                    {Object.values(EEurope).map((value, index) => (
                                        <p key={index} className={`hover:underline active:underline cursor-pointer`}
                                           onClick={() => alert("FIXME")}>
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className={`cursor-pointer flex justify-between items-center`}
                                 onClick={() => handleSetShowContinent(EContinent.Africa)}>
                                <div className={`flex gap-2 items-center`}>
                                    <FaEarthAfrica />
                                    <p className={`font-bold`}>
                                        Africa
                                    </p>
                                </div>

                                {showContinent === EContinent.Africa ? (
                                    <LiaAngleUpSolid />
                                ) : (
                                    <LiaAngleDownSolid />
                                )}
                            </div>

                            {showContinent === EContinent.Africa && (
                                <div>
                                    {Object.values(EAfrica).map((value, index) => (
                                        <p key={index} className={`hover:underline active:underline cursor-pointer`}
                                           onClick={() => alert("FIXME")}>
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className={`cursor-pointer flex justify-between items-center`}
                                 onClick={() => handleSetShowContinent(EContinent.NorthAmerica)}>
                                <div className={`flex gap-2 items-center`}>
                                    <FaEarthAmericas />
                                    <p className={`font-bold`}>
                                        North America
                                    </p>
                                </div>

                                {showContinent === EContinent.NorthAmerica ? (
                                    <LiaAngleUpSolid />
                                ) : (
                                    <LiaAngleDownSolid />
                                )}
                            </div>

                            {showContinent === EContinent.NorthAmerica && (
                                <div>
                                    {Object.values(ENorthAmerica).map((value, index) => (
                                        <p key={index} className={`hover:underline active:underline cursor-pointer`}
                                           onClick={() => alert("FIXME")}>
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className={`cursor-pointer flex justify-between items-center`}
                                 onClick={() => handleSetShowContinent(EContinent.SouthAmerica)}>
                                <div className={`flex gap-2 items-center`}>
                                    <FaEarthAmericas />
                                    <p className={`font-bold`}>
                                        South America
                                    </p>
                                </div>

                                {showContinent === EContinent.SouthAmerica ? (
                                    <LiaAngleUpSolid />
                                ) : (
                                    <LiaAngleDownSolid />
                                )}
                            </div>

                            {showContinent === EContinent.SouthAmerica && (
                                <div>
                                    {Object.values(ESouthAmerica).map((value, index) => (
                                        <p key={index} className={`hover:underline active:underline cursor-pointer`}
                                           onClick={() => alert("FIXME")}>
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className={`cursor-pointer flex justify-between items-center`}
                                 onClick={() => handleSetShowContinent(EContinent.Asia)}>
                                <div className={`flex gap-2 items-center`}>
                                    <FaEarthAsia />
                                    <p className={`font-bold`}>
                                        Asia
                                    </p>
                                </div>

                                {showContinent === EContinent.Asia ? (
                                    <LiaAngleUpSolid />
                                ) : (
                                    <LiaAngleDownSolid />
                                )}
                            </div>

                            {showContinent === EContinent.Asia && (
                                <div>
                                    {Object.values(EAsia).map((value, index) => (
                                        <p key={index} className={`hover:underline active:underline cursor-pointer`}
                                           onClick={() => alert("FIXME")}>
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <div className={`cursor-pointer flex justify-between items-center`}
                                 onClick={() => handleSetShowContinent(EContinent.Oceania)}>
                                <div className={`flex gap-2 items-center`}>
                                    <FaEarthOceania />
                                    <p className={`font-bold`}>
                                        Oceania
                                    </p>
                                </div>

                                {showContinent === EContinent.Oceania ? (
                                    <LiaAngleUpSolid />
                                ) : (
                                    <LiaAngleDownSolid />
                                )}
                            </div>

                            {showContinent === EContinent.Oceania && (
                                <div>
                                    {Object.values(EOceania).map((value, index) => (
                                        <p key={index} className={`hover:underline active:underline cursor-pointer`}
                                           onClick={() => alert("FIXME")}>
                                            {value}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

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
                            <Link href={`/contact`} className={`hover:underline active:underline cursor-pointer`}
                            onClick={() => setShowDrawer(false)}>
                                Contact
                            </Link>
                            <Link href={`/advertise`} className={`hover:underline active:underline cursor-pointer`}
                                  onClick={() => setShowDrawer(false)}>
                                Advertise on Zone Trail
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