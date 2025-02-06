import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import { connectDB } from "./config/db";
import authRouter from "./routers/auth";
import productRouter from "./routers/product";
import categoryRouter from "./routers/category";
import cartRouter from "./routers/cart";
import orderRouter from "./routers/order";
const app = express();
dotenv.config();
// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));


const PORT = 8080; // Đặt cổng cho backend

app.use(
    cors({
        origin: "http://localhost:5173", // Thay đổi thành địa chỉ frontend của bạn
    })
);


// connect db
connectDB("mongodb://0.0.0.0:27017/bookingapp");

// routers
app.use("/api", authRouter);
app.use("", productRouter);
app.use("/api", categoryRouter);
app.use("", cartRouter);
app.use("", orderRouter);

export const viteNodeApp = app;

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});