import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import {describe, expect, it, beforeEach} from "vitest";
import userAuthMiddleware from "../../src/api/middleware/auth.js";
import adminAuthMiddleware from "../../src/api/middleware/adminAuth.js";

describe("auth middleware integration", () => {
    beforeEach(() => {
        process.env.JWT_SECRET = "user-secret";
        process.env.ADMIN_JWT_SECRET = "admin-secret";
    });

    it("authorizes user requests with a valid bearer token", async () => {
        const app = express();
        app.get("/user", userAuthMiddleware, (req, res) => {
            res.json({userId: (req as {userId?: string}).userId, email: (req as {email?: string}).email});
        });

        const token = jwt.sign({userId: "user-123", email: "user@example.com"}, process.env.JWT_SECRET);
        const response = await request(app)
            .get("/user")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({userId: "user-123", email: "user@example.com"});
    });

    it("rejects user requests without a token", async () => {
        const app = express();
        app.get("/user", userAuthMiddleware, (req, res) => {
            res.json({ok: true});
        });

        const response = await request(app).get("/user");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: "41",
            message: "Unauthorized Access",
            data: "missing or invalid token",
        });
    });

    it("rejects admin requests when token payload lacks id", async () => {
        const app = express();
        app.get("/admin", adminAuthMiddleware, (req, res) => {
            res.json({adminId: (req as {adminId?: string}).adminId});
        });

        const token = jwt.sign({email: "admin@example.com"}, process.env.ADMIN_JWT_SECRET);
        const response = await request(app).get("/admin").set("Authorization", token);

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            code: "41",
            message: "Unauthorized Access",
            data: "Invalid or Expired token",
        });
    });

    it("authorizes admin requests with a valid token", async () => {
        const app = express();
        app.get("/admin", adminAuthMiddleware, (req, res) => {
            res.json({adminId: (req as {adminId?: string}).adminId, email: (req as {email?: string}).email});
        });

        const token = jwt.sign({id: "admin-123", email: "admin@example.com"}, process.env.ADMIN_JWT_SECRET);
        const response = await request(app).get("/admin").set("Authorization", token);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({adminId: "admin-123", email: "admin@example.com"});
    });
});
