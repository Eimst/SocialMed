import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import NavBar from "@/app/nav/NavBar";
import ToasterProvider from "@/app/providers/ToastProvider";
import FriendsLayout from "@/app/layouts/FriendsLayout";
import FetchPosts from "@/app/utils/FetchPosts";

export const metadata: Metadata = {
    title: "SocialMed",
    description: "Mini social media web application",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;

}>) {

    return (
        <html lang="en">
        <body
        >
        <FetchPosts/>
        <ToasterProvider/>

        <NavBar />

        <main className="container max-w-full">
            <FriendsLayout>
                {children}
            </FriendsLayout>

        </main>
        </body>
        </html>
    );
}
