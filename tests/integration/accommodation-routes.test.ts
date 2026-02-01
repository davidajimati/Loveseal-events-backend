import express from "express";
import request from "supertest";
import {beforeEach, describe, expect, it, vi} from "vitest";

const accommodationController = {
    createFacility: vi.fn((_req, res) => res.status(200).json({action: "facility"})),
    getFacility: vi.fn((_req, res) => res.status(200).json({action: "get-facility"})),
    getHotelRooms: vi.fn((_req, res) => res.status(200).json({action: "hotels"})),
    createCategories: vi.fn((_req, res) => res.status(200).json({action: "category"})),
    createHostelAccommodation: vi.fn((_req, res) => res.status(200).json({action: "hostel"})),
    createHotelAccommodation: vi.fn((_req, res) => res.status(200).json({action: "hotel"})),
    getAllCategoriesInfo: vi.fn((_req, res) => res.status(200).json({action: "categories"})),
    createAccommodationRequest: vi.fn((_req, res) => res.status(200).json({action: "initialize"})),
};

vi.mock("../../src/api/accommodation/controller/accommodation.controller.js", () => accommodationController);
vi.mock("../../src/api/middleware/auth.js", () => ({
    default: (_req: express.Request, _res: express.Response, next: express.NextFunction) => next(),
}));

const {default: registerAccommodationRoutes} = await import(
    "../../src/api/accommodation/route/accommodation.routes.js"
);

describe("accommodation routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("wires accommodation endpoints", async () => {
        const app = express();
        app.use(express.json());
        registerAccommodationRoutes(app);

        await request(app).post("/accommodation/facility").send({}).expect(200, {action: "facility"});
        await request(app).get("/accommodation/facility/1").expect(200, {action: "get-facility"});
        await request(app).get("/accommodation/hotels/1").expect(200, {action: "hotels"});
        await request(app).post("/accommodation/category").send({}).expect(200, {action: "category"});
        await request(app).post("/accommodation/hostel").send({}).expect(200, {action: "hostel"});
        await request(app).post("/accommodation/hotel").send({}).expect(200, {action: "hotel"});
        await request(app).get("/accommodation/categories").expect(200, {action: "categories"});
        await request(app).post("/accommodation/initialize").send({}).expect(200, {action: "initialize"});
        await request(app)
            .delete("/accommodation/delete-accommodation/1")
            .expect(501, {code: "99", message: "Not Implemented", data: null});

        expect(accommodationController.createFacility).toHaveBeenCalled();
        expect(accommodationController.getFacility).toHaveBeenCalled();
        expect(accommodationController.getHotelRooms).toHaveBeenCalled();
        expect(accommodationController.createCategories).toHaveBeenCalled();
        expect(accommodationController.createHostelAccommodation).toHaveBeenCalled();
        expect(accommodationController.createHotelAccommodation).toHaveBeenCalled();
        expect(accommodationController.getAllCategoriesInfo).toHaveBeenCalled();
        expect(accommodationController.createAccommodationRequest).toHaveBeenCalled();
    });
});
