'use client'

import React, {useEffect, useRef, useState} from 'react';
import {FaSearch} from "react-icons/fa";
import SearchField from "@/app/nav/SearchField";

function Search() {
    const [searchText, setSearchText] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const searchFieldRef = useRef<{ focusFirstUser: () => void } | null>(null);
    const searchContainerRef = useRef<HTMLDivElement | null>(null);

    const handleMouseEnter = () => {
        setIsVisible(true);
    };
    
    const handleSearchButtonClick = () => {
        if (searchFieldRef.current) {
            searchFieldRef.current.focusFirstUser();
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        // Check if the click happened outside the referenced container
        if (
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target as Node)
        ) {
            console.log('Mouse clicked outside');
            setIsVisible(false); // Hide the element
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative w-[40%]`}
             ref={searchContainerRef}
             onMouseEnter={handleMouseEnter}
        >
            <div className={`flex items-center border-2 rounded-full py-2 shadow-sm`}>
                <input
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}
                    type="text"
                    placeholder='Search for a person'
                    className='input-custom'/>
                <button
                    type="button"
                    onClick={handleSearchButtonClick}
                    onKeyDown={(key) => {
                        if (key.key === 'Enter') {
                            handleSearchButtonClick()
                        }
                    }}
                >
                    <FaSearch
                        size={34}
                        className='bg-red-600 text-white rounded-full p-2 cursor-pointer mx-2'
                    />
                </button>

            </div>
            {
                searchText !== '' && (
                    <SearchField searchText={searchText} setSearchText={setSearchText} isVisible={isVisible} ref={searchFieldRef}/>
                )
            }

        </div>
    );
}

export default Search;