import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from"cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { connect } from "mongoose";

const app = express();

dotenv.config()
const PORT = process.env.PORT
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}))

app.use("/api/auth", authRoutes)

app.use("/api/messages", messageRoutes)

app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`);
    connectDB();
})