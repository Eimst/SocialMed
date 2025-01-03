import React from 'react';

function UpdateNewsBoard() {
    return (
        <>
            <h2 className={`text-md font-semibold text-center text-green-600`}>Implemented Features</h2>
            <ul className={`list-disc text-sm py-1 pl-5`}>
                <li>Search for a person</li>
                <li>Ability to add or remove a person from your friends</li>
                <li>View your friends in the &#34;Friends&#34; tab</li>
                <li>View other people&#39;s friend lists</li>
                <li>View your profile and others&#39; profiles</li>
                <li>Create and delete posts</li>
                <li>Create and delete comments</li>
                <li>Register and log in</li>
            </ul>

            <h2 className={`mt-4 text-md font-semibold text-center text-red-600`}>In Development</h2>
            <ul className={`list-disc text-sm py-1 pl-5`}>
                <li>Real-time updates for posts and comments</li>
                <li>End-to-end encrypted messaging with friends</li>
                <li>Real-time messaging updates</li>
                <li>Like posts</li>
                <li>Update your profile bio and image</li>
            </ul>
        </>

    );
}

export default UpdateNewsBoard;