import React from "react";
import { TbMessage2Filled } from "react-icons/tb";

function MessageIconWithCount() {
    return (
        <div className="relative w-10 h-10">
            {/* The icon */}
            <TbMessage2Filled size={40} className="text-blue-500" />

            {/* The count */}
            <span
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
                5
            </span>
        </div>
    );
}

export default MessageIconWithCount;
