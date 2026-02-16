import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(8, 8, 11)",
                foreground: "rgb(248, 250, 252)",
                primary: {
                    DEFAULT: "rgb(59, 130, 246)",
                    foreground: "rgb(15, 23, 42)",
                },
                secondary: {
                    DEFAULT: "rgb(30, 41, 59)",
                    foreground: "rgb(248, 250, 252)",
                },
                muted: {
                    DEFAULT: "rgb(30, 41, 59)",
                    foreground: "rgb(148, 163, 184)",
                },
                accent: "rgb(30, 41, 59)",
                border: "rgb(30, 41, 59)",
                card: "rgb(15, 23, 42)",
            },
            borderRadius: {
                lg: "0.5rem",
                md: "0.375rem",
                sm: "0.25rem",
            },
        },
    },
    plugins: [],
};

export default config;
