import dns from "dns";
import cors from "cors";
import dotenv from "dotenv";
import app from "./server.js";
import bodyParser from "body-parser";
import compression from 'compression';
import { PrismaClient } from "@prisma/client";
import express, {} from "express";
dotenv.config();
const prisma = new PrismaClient();
const corsOptions = {
    origin: "*",
    method: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
const handleInvalidPayload = (err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            responseCode: "99",
            responseMsg: "Invalid JSON payload",
            responseData: err.message
        });
    }
    next(err);
};
const handleInternalServerError = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        responseCode: "100",
        responseMsg: "Internal Server Error"
    });
    next(err);
};
async function connectDB() {
    try {
        await prisma.$connect();
        console.log("✅ Connected to PostgreSQL via Prisma!");
    }
    catch (err) {
        console.error("❌ Failed to connect to PostgreSQL:", err);
        process.exit(1);
    }
}
connectDB();
app.use(compression());
app.use(cors(corsOptions));
app.use(handleInvalidPayload);
app.use(handleInternalServerError);
app.use(express.json({ limit: "2mb" }));
app.options("*", cors(corsOptions));
dns.setDefaultResultOrder("ipv4first");
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.get("/", (_req, res) => {
    res.redirect(`https://wothsmflx.org`);
});
const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map