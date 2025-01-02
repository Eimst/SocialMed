import type { NextConfig } from "next";

if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const nextConfig: NextConfig = {
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    images: {
        remotePatterns: [
            {protocol: "https", hostname: "cdn.pixabay.com"}
        ]
    },
    output: "standalone",
};

export default nextConfig;
