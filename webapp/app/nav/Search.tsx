'use client'

import React from 'react';
import {FaSearch} from "react-icons/fa";

function Search() {
    return (
        <div className={`flex w-[40%] items-center border-2 rounded-full py-2 shadow-sm`}>
            <input
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                    }
                }}

                type="text"
                placeholder='Search for a person'
                className='input-custom'/>
            <button

            >
                <FaSearch
                    size={34}
                    className='bg-red-600 text-white rounded-full p-2 cursor-pointer mx-2'
                />
            </button>
        </div>
    );
}

export default Search;