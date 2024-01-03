import './globals.css';
import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: 'Trail Forum',
    description: 'The trail runners community',
};

export default function RootLayout({children}: { children: React.ReactNode} )  {
    return (
        <html lang='fr'>
            <body>
                {children}
            </body>
        </html>
    );
}