"use client";

import React, {createContext, FC, ReactNode, useContext, useState} from "react";
import {Country} from "@/lib/types";

interface ICountryContextProps {
    country: Country | undefined,
    setCountry: React.Dispatch<React.SetStateAction<Country | undefined>>,
}

interface ICountryProviderProps {
    children: ReactNode;
}

const CountryContext = createContext<ICountryContextProps | undefined>(undefined);

export const CountryProvider: FC<ICountryProviderProps> = ({ children }) => {
    const [country, setCountry] = useState<Country>();

    return (
        <CountryContext.Provider value={{ country, setCountry }}>
            {children}
        </CountryContext.Provider>
    );
};

export const useCountry = () => {
    const context = useContext(CountryContext);

    if (!context) {
        throw new Error("useCountry must be used within a CountryProvider");
    }

    return context;
};
