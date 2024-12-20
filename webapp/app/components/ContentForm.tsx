'use client'

import React from 'react';
import EmojiPicker from "@/app/components/EmojiPicker";
import {MdOutlineEmojiEmotions} from "react-icons/md";


type Props = {
    isEmojiActive: boolean;
    content: string;
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    addEmoji: (emoji: { native: string }) => void;
    placeholder?: string;
    setIsEmojiActive: (isEmojiActive: boolean) => void;
};


function ContentForm({isEmojiActive, content, handleChange, addEmoji, placeholder, setIsEmojiActive}: Props) {
    return (
        <div
            className={`border-2 rounded-xl transition-all overflow-hidden min-h-[200px] bg-white ${
                isEmojiActive ? "h-[500px]" : "h-20"
            }`}
        >
            <textarea
                value={content}
                onChange={handleChange}
                className={`${isEmojiActive ? 'w-[65%]' : 'w-full'} h-full py-1 px-3 border-none resize-none text-justify`}
                placeholder={placeholder}
                style={{paddingRight: "3rem"}} // Padding for emoji button
            />
            {isEmojiActive && (
                <div className="w-full">
                    <EmojiPicker addEmoji={addEmoji}/>
                </div>
            )}
            <button
                type="button"
                className={`absolute right-2 bottom-2 rounded-full px-3 py-1 hover:bg-gray-300`}
                onClick={() => {
                    setIsEmojiActive(!isEmojiActive);
                }}
            >
                <MdOutlineEmojiEmotions size={30}/>
            </button>
        </div>
    );
}

export default ContentForm;