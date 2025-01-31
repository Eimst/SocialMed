'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
    const router = useRouter();

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-9xl font-bold text-red-500">404</h1>
            <p className="text-2xl font-semibold text-gray-700 mt-4">
                Oops! The page you&#39;re looking for doesn&#39;t exist.
            </p>
            <p className="text-lg text-gray-600 mt-2">
                It might have been moved or deleted.
            </p>
            <button
                onClick={handleGoHome}
                className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
                Go Back Home
            </button>
        </div>
    );
};

export default NotFound;
