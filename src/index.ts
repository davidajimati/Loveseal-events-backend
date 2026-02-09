import dotenv from "dotenv";
import app from "./server.js"
import {PrismaClient} from "@prisma/client"

dotenv.config();
const prisma = new PrismaClient()


async function connectDB() {
    try {
        await prisma.$connect();
        console.log("✅ Connected to MySql via Prisma!");
    } catch (err) {
        console.error("❌ Failed to connect to MySql:", err);
        process.exit(1);
    }
}

await connectDB();


/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 */
app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});

app.get("/", (_req, res) => {
    res.redirect(`https://wothsmflx.org`);
})

const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
