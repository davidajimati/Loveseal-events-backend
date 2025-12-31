import { Router } from "express";

export default function registerCommsRoutes(app: Router) {
    const router = Router();

    router.get("/", (_req, res) => res.send("User list"));
    router.post("/", (_req, res) => res.send("Create user"));

    app.use("/user-auth", router);
}