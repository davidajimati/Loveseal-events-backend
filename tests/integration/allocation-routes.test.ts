import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

vi.mock("../../src/api/accommodation/controller/allocation.controller.js", () => ({
    allocationController: {
        secureAccommodation: vi.fn((res: express.Response) =>
            res.status(200).json({action: "allocate"}),
        ),
    },
}));
vi.mock("../../src/api/middleware/auth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

const {default: registerAllocationRoutes} = await import(
    "../../src/api/accommodation/route/allocation.routes.js"
);

describe("allocation routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires allocation endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerAllocationRoutes(app);

        await request(app).post("/allocation/hostel").send({}).expect(200, {action: "allocate"});
    });
});
