import { Router } from "express";
import { allocationController } from "../controller/allocation.controller.js";
import auth from "@api/middleware/auth.js";

export default function registerAllocationRoutes(app: Router) {
  const router = Router();

  router.post("/hostel", auth, (req, res) =>
    allocationController.secureAccommodation(res, req),
  );

  app.use("/allocation", router);
}
