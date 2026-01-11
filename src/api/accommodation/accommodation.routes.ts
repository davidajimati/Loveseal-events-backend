import { Router } from "express";
import * as controller from "./accommodation.controller.js";

export default function registerAccommodationRoutes(app: Router) {
  const router = Router();

  router.get("/", (_req, res) => res.send("User list"));
  router.post("/facility", controller.createFacility);
  router.delete("/delete-accommodation/:accommodationId", (req, res) => {});

  app.use("/accommodation", router);
}
