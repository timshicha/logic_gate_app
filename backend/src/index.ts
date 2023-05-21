import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

app.listen({port: Number(process.env.PORT)});
