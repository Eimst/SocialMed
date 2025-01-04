import React from 'react';

function UpdateNewsBoard() {
    return (
        <>
            <h2 className={`text-md font-semibold text-center mb-5`}>Feature Overview</h2>
            <h2 className={`text-md font-semibold pl-5 text-green-600`}>Implemented Features</h2>
            <ul className={`list-disc text-sm py-1 pl-5`}>
                <li>Real-time updates for posts and comments with signalR (add/delete)</li>
                <li>Search for a person</li>
                <li>View your friends in the &#34;Friends&#34; tab</li>
                <li>View other people&#39;s friend lists</li>
                <li>Ability to add or remove a person from your friends</li>
                <li>View your profile and others&#39; profiles</li>
                <li>Create and delete posts</li>
                <li>Create and delete comments</li>
                <li>Register and log in</li>
            </ul>

            <h2 className={`mt-4 text-md font-semibold pl-5 text-red-600`}>In Development</h2>
            <ul className={`list-disc text-sm py-1 pl-5`}>
                <li>End-to-end encrypted messaging with friends</li>
                <li>Real-time messaging updates</li>
                <li>Like posts</li>
                <li>Update your profile bio and image</li>
                <li>Share post on your profile</li>
            </ul>
            <h2 className={`mt-40 text-sm font-semibold text-center uppercase`}>Site is for desktops only</h2>
        </>

    );
}

export default UpdateNewsBoard;