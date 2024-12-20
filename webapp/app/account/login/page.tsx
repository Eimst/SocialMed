import React from 'react';
import LoginForm from "@/app/account/login/LoginForm";


function Page() {
    return (
        <div className={`mt-40`}>
            <div className={`mx-auto max-w-[50%] shadow-xl p-10 bg-white rounded-lg`}>
                <LoginForm/>
            </div>
        </div>


    );
}

export default Page;