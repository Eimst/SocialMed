import type {Config} from "tailwindcss";
import flowbite from "flowbite/plugin";
import tailwind_scrollbar_hide from "tailwind-scrollbar-hide";
import forms from "@tailwindcss/forms";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/flowbite/**/*.js",
        "./node_modules/flowbite-react/**/*.js",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [
        flowbite,
        tailwind_scrollbar_hide,
        forms,
    ],
} satisfies Config;
