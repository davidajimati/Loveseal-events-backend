import { Router } from "express";

export default function registerUserRoutes(app: Router) {
    const router = Router();

    router.get("/", (_req, res) => res.send({"response":"User list"}));
    router.post("/", (_req, res) => res.send({"response":"Create user"}));

    app.use("/user", router);
}