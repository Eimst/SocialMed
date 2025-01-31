import React, {useEffect, useRef, useState} from 'react';
import Friend from "@/app/friends/Friend";
import Messages from "@/app/messages/Messages";
import {UserProfileInfo} from "@/types";


type Props = {
    chattingWithFriend: UserProfileInfo
}

function ScrollableChat({ chattingWithFriend }: Props) {
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isAtTop, setIsTop] = useState(false);
    const [friendHeight, setFriendHeight] = useState(0);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const friendRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (friendRef.current) {
            setFriendHeight(friendRef.current.getBoundingClientRect().height);
        }
    }, []);

    const checkScrollPosition = () => {
        if (!containerRef.current)
            return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 10);
        setIsTop(scrollTop <= friendHeight + 5)
    };

    return (
        <div className="h-full flex flex-col">
            {/* Sticky Friend Info */}
            <div ref={friendRef} className="sticky top-0 z-10">
                <Friend user={chattingWithFriend} showMessageIcon={false}/>
            </div>
            {/* Scrollable Messages */}
            <div className="flex-grow overflow-y-auto scrollbar-hide mb-2" onScroll={checkScrollPosition}
                 ref={containerRef}>
                <Messages friend={chattingWithFriend} isAtBottom={isAtBottom} isAtTop={isAtTop} />
            </div>
        </div>
    );
}

export default ScrollableChat;