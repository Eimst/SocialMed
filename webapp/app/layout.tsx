
import "./globals.css";
import React from "react";
import NavBar from "@/app/nav/NavBar";
import ToasterProvider from "@/app/providers/ToastProvider";
import FriendsLayout from "@/app/layouts/FriendsLayout";
import FetchPosts from "@/app/utils/FetchPosts";
import SignalR from "@/app/providers/SignalR";

// export const metadata: Metadata = {
//     title: "SocialMed",
//     description: "Mini social media web application",
// };

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;

}>) {

    const notifyUrl = process.env.NOTIFY_URL ?? "";
    return (
        <html lang="en">
        <head>
            <title>SocialMed</title>
            <meta name="description" content="Mini social media web application"/>
        </head>
        <body
        >
        <FetchPosts/>
        <ToasterProvider/>

        <NavBar/>

        <main className="container max-w-full">
            <SignalR notifyUrl={notifyUrl}>
                <FriendsLayout>
                    {children}
                </FriendsLayout>
            </SignalR>

        </main>
        </body>
        </html>
    );
}
