import React from 'react';

function UpdateNewsBoard() {
    return (
        <>
            <h2 className={`text-md font-semibold text-center mb-5`}>Feature Overview</h2>
            <h2 className={`text-md font-semibold pl-5 text-green-600`}>Implemented Features</h2>
            <ul className={`list-disc text-sm py-1 pl-5`}>
                <li>Real-Time Unread Message Handling: Messages are dynamically marked as read when a friend opens your
                    chat, ensuring seamless updates.
                </li>
                <li>Real-Time Message Updates: Messages are delivered instantly for a smooth communication experience.
                </li>
                <li>Encrypted Messaging with Server-Side Encryption: Messages are securely encrypted on the server,
                    ensuring safe and private communication between friends.
                </li>
                <li>Real-Time Post and Comment Updates: SignalR enables live updates for adding and deleting posts and
                    comments.
                </li>
                <li>Search for people.</li>
                <li>View your friends in the &#34;Friends&#34; tab.</li>
                <li>Browse other users&#39; friend lists.</li>
                <li>Add or remove friends.</li>
                <li>View your profile and other users&#39; profiles.</li>
                <li>Create and delete posts.</li>
                <li>Create and delete comments.</li>
                <li>Register and log in.</li>

            </ul>

            <h2 className={`mt-4 text-md font-semibold pl-5 text-red-600`}>In Development</h2>
            <ul className={`list-disc text-sm py-1 pl-5`}>
                <li>Update your profile bio and image.</li>
                <li>Notification then message is received.</li>
                <li>Unread messages count.</li>
                <li>Like posts.</li>
                <li>Pagination on posts, messages.</li>
                <li>Dynamic loading on posts, messages.</li>
                <li>Share post on your profile.</li>
            </ul>
            <h2 className={`mt-16 text-sm font-semibold text-center uppercase`}>Site is for desktops only</h2>
        </>

    );
}

export default UpdateNewsBoard;