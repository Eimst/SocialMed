'use client'

import React from 'react';
import {Toaster} from "react-hot-toast";

function ToasterProvider() {
    return (
        <div>
            <Toaster position='bottom-left'/>
        </div>
    );
}

export default ToasterProvider;