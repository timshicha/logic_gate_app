import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const configOptions = {
    plugins: [
        react()
    ],
    css: {
        postcss: "./postcss.config.js"
    }
}

export default defineConfig(configOptions);