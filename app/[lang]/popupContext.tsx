"use client";

import React, {createContext, FC, ReactNode, useContext, useState} from "react";
import {EAuthPopup} from "@/lib/enums";

interface IPopupContextProps {
    isAuthPopupVisible: boolean,
    popupType: EAuthPopup,
    changeAuthPopupType: (type: EAuthPopup) => void,
    showAuthPopup: () => void,
    hideAuthPopup: () => void,
    showSharePopup: (id: string) => void,
    hideSharePopup: () => void,
    sharePopupID: string,
    isSharePopupVisible: boolean,
    isInitAccountPopupVisible: boolean,
    showInitAccountPopup: () => void,
    hideInitAccountPopup: () => void,
    // showCountryPopup: () => void,
    // hideCountryPopup: () => void,
    // isCountryPopupVisible: boolean,
}

interface IPopupProviderProps {
    children: ReactNode;
}

const PopupContext = createContext<IPopupContextProps | undefined>(undefined);

export const PopupProvider: FC<IPopupProviderProps> = ({ children }) => {
    const [isAuthPopupVisible, setIsAuthPopupVisible] = useState(false);
    const [isSharePopupVisible, setIsSharePopupVisible] = useState(false);
    const [sharePopupID, setSharePopupID] = useState("");
    const [popupType, setPopupType] = useState(EAuthPopup.Login);
    const [isInitAccountPopupVisible, setIsInitAccountPopupVisible] = useState(false);

    const showAuthPopup = () => setIsAuthPopupVisible(true);

    const hideAuthPopup = () => setIsAuthPopupVisible(false);

    const showSharePopup = (id: string) => {
        setSharePopupID(id);
        setIsSharePopupVisible(true);
    };

    const hideSharePopup = () => {
        setSharePopupID("");
        setIsSharePopupVisible(false);
    }

    const changeAuthPopupType = (type: EAuthPopup) => setPopupType(type);

    const showInitAccountPopup = () => setIsInitAccountPopupVisible(true);

    const hideInitAccountPopup = () => setIsInitAccountPopupVisible(false);

    return (
        <PopupContext.Provider value={{
            isAuthPopupVisible,
            popupType,
            changeAuthPopupType,
            showAuthPopup,
            hideAuthPopup,
            showSharePopup,
            hideSharePopup,
            sharePopupID,
            isSharePopupVisible,
            isInitAccountPopupVisible,
            showInitAccountPopup,
            hideInitAccountPopup
        }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    const context = useContext(PopupContext);

    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }

    return context;
};
