import express from "express";
import request from "supertest";
import {describe, it, expect} from "vitest";

const {default: registerEmailingRoutes} = await import(
    "../../src/api/emailing/comms.routes.js"
);

describe("emailing routes", () => {
    it("wires emailing endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerEmailingRoutes(app);

        await request(app).post("/user-auth").send({}).expect(200, "Create user");
    });
});
