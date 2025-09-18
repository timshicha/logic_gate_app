
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";

const configOptions = {
    server: {
        port: 5173
    },
    plugins: [
        react(),
        tailwindcss()
    ],
};

export default defineConfig(configOptions);