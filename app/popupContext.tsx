"use client";

import React, {createContext, FC, ReactNode, useContext, useState} from "react";
import {EAuthPopup} from "@/lib/enums";

interface IPopupContextProps {
    isPopupVisible: boolean,
    popupType: EAuthPopup,
    changePopupType: (type: EAuthPopup) => void,
    showPopup: () => void,
    hidePopup: () => void,
    isUsernamePopupVisible: boolean,
    showUsernamePopup: () => void,
    hideUsernamePopup: () => void,
}

interface IPopupProviderProps {
    children: ReactNode;
}

const PopupContext = createContext<IPopupContextProps | undefined>(undefined);

export const PopupProvider: FC<IPopupProviderProps> = ({ children }) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupType, setPopupType] = useState(EAuthPopup.Login);
    const [isUsernamePopupVisible, setUsernamePopupVisible] = useState(false);

    const showPopup = () => setPopupVisible(true);

    const hidePopup = () => setPopupVisible(false);

    const changePopupType = (type: EAuthPopup) => setPopupType(type);

    const showUsernamePopup = () => setUsernamePopupVisible(true);

    const hideUsernamePopup = () => setUsernamePopupVisible(false);

    return (
        <PopupContext.Provider value={{ isPopupVisible, popupType, changePopupType, showPopup, hidePopup, isUsernamePopupVisible, showUsernamePopup, hideUsernamePopup }}>
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
