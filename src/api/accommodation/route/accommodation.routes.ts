import { Router } from "express";
import * as controller from "../controller/accommodation.controller.js";
import auth from "@api/middleware/auth.js";
import adminAuth from "@api/middleware/auth.js";

export default function registerAccommodationRoutes(app: Router) {
  const router = Router();

  router.post("/facility", adminAuth, controller.createFacility);
  router.get("/facility/:categoryId", auth, controller.getFacility);
  router.get("/hotels/:facilityId", auth, controller.getHotelRooms);
  router.post("/category", adminAuth, controller.createCategories);
  router.post("/hostel", adminAuth, controller.createHostelAccommodation);
  router.post("/hotel", adminAuth, controller.createHotelAccommodation);
  router.get("/categories", auth, controller.getAllCategoriesInfo);
  router.post("/initialize", auth, controller.createAccommodationRequest);

  app.use("/accommodation", router);
}
