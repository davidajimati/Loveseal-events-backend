import { Router } from "express";
import * as controller from "./accommodation.controller.js";

export default function registerAccommodationRoutes(app: Router) {
  const router = Router();

  router.get("/", (_req, res) => res.send("User list"));
  router.post("/facility", controller.createFacility);
  router.get("/facility/:categoryId", controller.getFacility);
  router.get("/hotels/:facilityId", controller.getHotelRooms);
  router.post("/category", controller.createCategories);
  router.post("/hostel", controller.createHostelAccommodation);
  router.post("/hotel", controller.createHotelAccommodation);
  router.get("/categories", controller.getAllCategoriesInfo);
  router.delete("/delete-accommodation/:accommodationId", (req, res) => {});

  app.use("/accommodation", router);
}
