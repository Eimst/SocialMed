import React from 'react';
import Profile from "@/app/account/profile/[id]/Profile";


interface PageProps {
    params: Promise<{ id: string }>;
}

async function Page({ params}: PageProps) {
    const resolvedParams = await params;

    return (
        <div className={`mt-40`}>
            <Profile id={resolvedParams.id}/>
        </div>

    );
}

export default Page;