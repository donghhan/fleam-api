import dotenv from "dotenv";
dotenv.config();

export const FLEAM_SECRET_KEY: string = String(process.env.FLEAM_SECRET_KEY);
