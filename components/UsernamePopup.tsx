import toast, {Toaster} from "react-hot-toast";
import React, {ReactNode, useEffect, useRef, useState} from "react";
import {useAuth} from "@/app/[lang]/authContext";
import {usePopup} from "@/app/[lang]/popupContext";
import {isUsernameAvailable} from "@/lib/utils";
import {doc, updateDoc} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";
import {BsArrowRight} from "react-icons/bs";
import {Country} from "@/lib/types";
import {EAsia, EEurope} from "@/lib/enums";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import {allCountries} from "@/lib/consts";

export default function UsernamePopup({ dictionary }: { dictionary: any }) {
    const {userData} = useAuth();
    const {hideUsernamePopup} = usePopup();

    const countryRef = useRef<HTMLDivElement>(null);

    const usernameRegex = /^[a-zA-Z0-9_-]{4,15}$/;

    const [username, setUsername] = useState(String(userData?.username));
    const [countrySearch, setCountrySearch] = useState<string>(EAsia.Afghanistan);
    const [showSearchCountry, setShowSearchCountry] = useState(false);
    const [charging, setCharging] = useState(false);
    const [index, setIndex] = useState(0);

    const handleChangeCountrySearch = (value: string) => {
        setCountrySearch(value);
        setShowSearchCountry(false);
    };

    const filterCountries = (): ReactNode => {
        const filteredCountries = Object.values(allCountries).filter((value) => String(value).includes(countrySearch));

        return filteredCountries.length === 0 ? (
            <div key={index} className={`px-3 py-2`}>
                No Result.
            </div>
        ) : (
            filteredCountries.map((value, index) => (
                <div key={index} className={`px-3 py-2 hover:bg-gray-200 active:bg-gray-100 cursor-pointer`}
                     onClick={() => handleChangeCountrySearch(String(value))}>
                    {value}
                </div>
            ))
        );
    };

    const handleUsername = async () => {
        setCharging(true);

        if (!usernameRegex.test(username)) {
            toast.error("Username should be between 4 and 15 characters long");
        }
        else if (!(await isUsernameAvailable(username))) {
            toast.error("Username not available");
        }
        else {
            setIndex(1);
        }

        setCharging(false);
    };

    const publish = async () => {
        // FIXME
        setCharging(true);

        if (!Object.values(allCountries).includes(countrySearch as Country)) {
            toast.error(`Unknown country ${countrySearch}`);
        }

        else {
            await updateDoc(doc(db, "users", String(userData?.uid)), {
                username,
                country: countrySearch
            });

            setCharging(false);
            toast.success("You are now logged in");
            hideUsernamePopup();
        }
    };

    const steps = [
        (
            <>
                <h2 className={`mb-10 text-2xl font-bold`}>
                    {dictionary.register.createUsername}
                </h2>

                <p className={`px-5 py-2 mb-5 text-center`}>
                    Zone Trail {dictionary.register.usernameText}
                </p>

                <div className={`w-full md:w-[400px] mb-10 flex flex-col items-center gap-1`}>
                    <input type={`text`} className={`w-1/2 px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={dictionary.register.username}
                           onChange={(event) => setUsername(event.target.value)} value={username}/>
                </div>

                <div className={`px-5 py-2 mb-5 flex items-center gap-3 rounded-lg bg-orange-500 text-white cursor-pointer`}
                     onClick={() => handleUsername().catch((error) => console.log(error.message))}>
                    {dictionary.register.continue}
                    <BsArrowRight />
                </div>
            </>
        ),
        (
            <div className={`relative flex flex-col items-center`}>
                <h2 className={`mb-10 text-2xl font-bold`}>
                    Select your country
                </h2>

                <div className={`relative flex flex-col`} ref={countryRef}>
                    <div className={`w-full md:w-[400px] pr-4 mb-10 flex justify-evenly items-center gap-1 cursor-pointer 
                        rounded-lg border-[1px] border-black`}
                         onClick={() => setShowSearchCountry(true)}>
                        <input type={`text`} className={`px-4 py-2 flex-grow text-sm rounded-lg outline-0`}
                               onChange={(event) => setCountrySearch(event.target.value)}
                               value={countrySearch}/>

                        {showSearchCountry ? (
                            <LiaAngleUpSolid />
                        ) : (
                            <LiaAngleDownSolid />
                        )}
                    </div>

                    <div className={`${!showSearchCountry && "hidden"} min-w-full w-max max-h-[300px] overflow-y-auto absolute 
                        top-12 left-1/2 -translate-x-1/2 bg-white shadow-md border-[1px] border-black`}>
                        {filterCountries()}
                    </div>
                </div>

                <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white cursor-pointer`}
                     onClick={publish}>
                    {charging ? `${dictionary.loading}...` : `${dictionary.register.finish}`}
                </div>
            </div>
        )
    ];

    useEffect(() => {
        const handleClickOutsideCountry = (event: MouseEvent) => {
            if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
                setShowSearchCountry(false);
            }
        };

        window.addEventListener('click', handleClickOutsideCountry);

        return () => window.removeEventListener('click', handleClickOutsideCountry);
    }, []);

    return (
        <div className={`w-full h-full bg-white fixed top-0 z-50 flex flex-col justify-center items-center`}>
            <Toaster />

            {steps[index]}
        </div>
    );
}