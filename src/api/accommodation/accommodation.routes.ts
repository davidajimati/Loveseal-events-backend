import { Router } from "express";

export default function registerAccommodationRoutes(app: Router) {
    const router = Router();

    router.get("/", (_req, res) => res.send("User list"));
    router.post("/", (_req, res) => res.send("Create user"));
    router.delete("/delete-accommodation/:accommodationId", (req, res) => {})

    app.use("/accommodation", router);
}