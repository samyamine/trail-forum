"use client";

import React, {ReactNode, useEffect, useRef, useState} from "react";
import {FcGoogle} from "react-icons/fc";
import {BsArrowRight} from "react-icons/bs";
import toast, {Toaster} from "react-hot-toast";
import {useAuth} from "@/app/[lang]/authContext";
import {usePopup} from "@/app/[lang]/popupContext";
import {isUsernameAvailable} from "@/lib/utils";
import {EAsia} from "@/lib/enums";
import {LiaAngleDownSolid, LiaAngleUpSolid} from "react-icons/lia";
import {allCountries} from "@/lib/consts";
import {Country} from "@/lib/types";

export default function RegisterPopup({ index, setIndexCallback, onSwitchAuthType, dictionary }: {index: number, setIndexCallback:  () => void, onSwitchAuthType:  React.MouseEventHandler<HTMLDivElement>, dictionary: any}) {
    const {signUpWithEmail, googleSignIn} = useAuth();
    const {hideAuthPopup, showInitAccountPopup} = usePopup();

    const countryRef = useRef<HTMLDivElement>(null);

    const handleSignInGoogle = async () => {
        try {
            const firstTimeSignIn = await googleSignIn();
            if (firstTimeSignIn) {
                hideAuthPopup();
                showInitAccountPopup();
            }
            else {
                hideAuthPopup();
                toast.success("You are now logged in");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[a-zA-Z0-9_-]{4,15}$/;
    const passwordRegex = /^(?=.*[a-zA-Z0-9])[\w!@#$%^&*()_-]{8,}$/;

    // FIXME: useRef
    const [charging, setCharging] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [username, setUsername] = useState("");
    const [countrySearch, setCountrySearch] = useState("");
    const [showSearchCountry, setShowSearchCountry] = useState(false);

    const errorCheckers = [
        (): boolean => !emailRegex.test(email),
        (): boolean => !usernameRegex.test(username),
        (): boolean => !Object.values(allCountries).includes(countrySearch),
        (): boolean => password !== passwordConfirmation || !passwordRegex.test(password),
    ];

    const errorMessages = [
        "Wrong e-mail format",
        "Username should contains at least 4 characters among letters, numbers, '_' and '-'",
        "Country does not exist",
        "passwords do not match and/or are not at least 8 characters long",
    ];

    const handleChangeCountrySearch = (value: string) => {
        setCountrySearch(value);
        setShowSearchCountry(false);
    };

    const filterCountries = (): ReactNode => {
        const sortedCountries = Object.values(allCountries).sort((a, b) => String(a).localeCompare(String(b)));
        const filteredCountries = Object.values(sortedCountries).filter((value) => String(value).includes(countrySearch));

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

    const steps = [
        (
            <>
                <h2 className={`mb-10 text-2xl font-bold`}>
                    {dictionary.register.register}
                </h2>

                <div className={`w-full px-5 py-2 rounded-lg border-[1px] border-black flex 
                    justify-center items-center gap-5 cursor-pointer text-xl`}
                    onClick={handleSignInGoogle}>
                    <FcGoogle />

                    <p className={`text-base`}>
                        {dictionary.register.google}
                    </p>
                </div>

                <div className={`w-full my-5 flex justify-between items-center`}>
                    <div className={`w-1/2 h-[1px] mr-3 bg-black`}></div>
                    {dictionary.register.or}
                    <div className={`w-1/2 h-[1px] ml-3 bg-black`}></div>
                </div>


                <div className={`w-full mb-10 flex flex-col items-center gap-5`}>
                    <input required={true} type={`email`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={dictionary.register.email}
                    onChange={(event) => setEmail(event.target.value)} value={email}/>
                </div>
            </>
        ),
        (
            <>
                <h2 className={`mb-10 text-2xl font-bold text-center`}>
                    {dictionary.register.createUsername}
                </h2>

                <p className={`px-5 py-2 mb-5 text-center`}>
                    Zone Trail {dictionary.register.usernameText}
                </p>

                <div className={`w-full mb-10 flex flex-col items-center gap-1`}>
                    <input type={`text`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={dictionary.register.username}
                    onChange={(event) => setUsername(event.target.value)} value={username}/>
                </div>
            </>
        ),
        (
            <div className={`relative flex flex-col items-center`}>
                <h2 className={`mb-10 text-2xl font-bold`}>
                    {dictionary.selectCountryPage.title}
                </h2>

                <div className={`w-full relative flex flex-col`} ref={countryRef}>
                    <div className={`w-full pr-4 mb-10 flex justify-evenly items-center gap-1 cursor-pointer 
                        rounded-lg border-[1px] border-black`}>

                        {/*FIXME: Translate countries*/}
                        <input type={`text`} className={`px-4 py-2 flex-grow text-sm rounded-lg outline-0`}
                               onClick={() => setShowSearchCountry(true)}
                               onChange={(event) => setCountrySearch(event.target.value)}
                               value={countrySearch}/>

                        <div className={`${!showSearchCountry && "hidden"}`} onClick={() => setShowSearchCountry(!showSearchCountry)}>
                            <LiaAngleUpSolid />
                        </div>

                        <div className={`${showSearchCountry && "hidden"}`} onClick={() => setShowSearchCountry(!showSearchCountry)}>
                            <LiaAngleDownSolid />
                        </div>

                        {/*{showSearchCountry ? (*/}
                        {/*    <LiaAngleUpSolid />*/}
                        {/*) : (*/}
                        {/*    <LiaAngleDownSolid />*/}
                        {/*)}*/}
                    </div>

                    <div className={`${!showSearchCountry && "hidden"} min-w-full w-max max-h-[300px] overflow-y-auto absolute 
                        top-12 left-1/2 -translate-x-1/2 bg-white shadow-md border-[1px] border-black`}>
                        {filterCountries()}
                    </div>
                </div>
            </div>
        ),
        (
            <>
                <h2 className={`mb-10 text-2xl font-bold text-center`}>
                    {dictionary.register.createPassword}
                </h2>

                <div className={`w-full mb-10 flex flex-col items-center gap-5`}>
                    <input type={`password`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={dictionary.register.password}
                    onChange={(event) => setPassword(event.target.value)} value={password}/>

                    <input type={`password`} className={`w-full px-4 py-2 bg-gray-100 rounded-lg
                        border-[1px] border-gray-400 text-sm placeholder-gray-400`} placeholder={dictionary.register.repeatPassword}
                    onChange={(event) => setPasswordConfirmation(event.target.value)} value={passwordConfirmation}/>
                </div>

                <p className={`px-5 py-2 mb-5 text-center text-sm`}>
                    {dictionary.register.termsAndConditionCaution} <span className={`underline text-orange-500 cursor-pointer`}> {dictionary.newTopic.termsAndCondition}</span>.
                </p>
            </>
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

    const buttonClickCallback = async () => {
        if (index === 3) {
            setCharging(true);

            if (errorCheckers[index]()) {
                toast.error(errorMessages[index]);
            }
            else if (!(await isUsernameAvailable(username))) {
                toast.error("Username not available");
            }
            else {
                try {
                    await signUpWithEmail(email, password, username, countrySearch);
                    setCharging(false);
                    hideAuthPopup();
                } catch (error: any) {
                    toast.error(error.message);
                }
            }

            setCharging(false);
        }
        else {
            if (errorCheckers[index]()) {
                toast.error(errorMessages[index]);
            }
            else {
                setIndexCallback();
            }
        }
    };

    const getRegisterButtonContent = () => {
        return charging ? `${dictionary.loading}...` : `${dictionary.register.register}`;
    };

    return (
        <div className={`w-full max-w-[320px] flex flex-col items-center`}>
            <Toaster toastOptions={{ duration: 3000 }} />

            <div className={`w-full max-md:px-3 flex flex-col text-center`}>
                {steps[index]}
            </div>

            <div className={`px-5 py-2 mb-5 rounded-lg bg-orange-500 text-white cursor-pointer ${index !== 3 && "flex items-center gap-3"}`}
            onClick={buttonClickCallback}>
                {index === 3 ? getRegisterButtonContent() : (
                    <>
                        {dictionary.register.continue}
                        <BsArrowRight />
                    </>
                )}
            </div>

            <div className={`flex gap-1 text-sm`}>
                <p>
                    {dictionary.register.alreadyRegistered}
                </p>
                <div className={`text-orange-500 underline cursor-pointer`} onClick={onSwitchAuthType}>
                    {dictionary.register.login}
                </div>
            </div>
        </div>
    );
}