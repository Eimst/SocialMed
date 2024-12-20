import React from 'react';
import RegisterForm from "@/app/account/register/RegisterForm";


function Page() {
    return (
        <div className={`mt-40`}>
            <div className={`mx-auto max-w-[50%] shadow-xl p-10 bg-white rounded-lg`}>
                <RegisterForm/>
            </div>
        </div>
    );
}

export default Page;