import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import { connect } from "mongoose";

const app = express();

dotenv.config()
const PORT = process.env.PORT
app.use(express.json());

app.use("/api/auth", authRoutes)

app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`);
    connectDB();
})