import dotenv from "dotenv";
import app from "./server.js"
import {PrismaClient} from "@prisma/client"

dotenv.config();
const prisma = new PrismaClient()


async function connectDB() {
    try {
        await prisma.$connect();
        console.log("✅ Connected to PostgreSQL via Prisma!");
    } catch (err) {
        console.error("❌ Failed to connect to PostgreSQL:", err);
        process.exit(1);
    }
}

connectDB();


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
