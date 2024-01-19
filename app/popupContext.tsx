"use client";

import React, {createContext, FC, ReactNode, useContext, useState} from "react";

interface IPopupContextProps {
    isPopupVisible: boolean,
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
    const [isUsernamePopupVisible, setUsernamePopupVisible] = useState(false);

    const showPopup = () => setPopupVisible(true);
    const hidePopup = () => setPopupVisible(false);

    const showUsernamePopup = () => setUsernamePopupVisible(true);

    const hideUsernamePopup = () => setUsernamePopupVisible(false);

    return (
        <PopupContext.Provider value={{ isPopupVisible, showPopup, hidePopup, isUsernamePopupVisible, showUsernamePopup, hideUsernamePopup }}>
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
