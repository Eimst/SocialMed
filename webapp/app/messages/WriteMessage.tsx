import React, {useState} from 'react';
import {IoMdSend} from "react-icons/io";
import toast from "react-hot-toast";


type Props = {
    sendMessage: (message: string) => void;
}

function WriteMessage({sendMessage}: Props) {
    const [content, setContent] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (content.trim().length < 1) {
            toast.dismiss()
            toast.error("Message cannot be empty");
        } else {
            sendMessage(content);
            setContent("");
        }

    }

    return (
        <div className={`bg-gray-50 border-2 rounded-lg border-blue-300`}>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={handleChange}
                    className={`w-full h-20 px-3 -mb-1.5 border-none resize-none text-justify bg-white rounded-lg shadow-md
                                focus:outline-none focus:ring-2 focus:ring-blue-300`}
                    style={{paddingRight: "3rem"}}
                />

                <button
                    type="submit"
                    className={`absolute right-2 bottom-2 rounded-full focus:outline-none focus:ring-0`}

                >
                    <IoMdSend size={30} color={`black`}/>
                </button>

            </form>

        </div>
    );
}

export default WriteMessage;