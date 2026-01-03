import { Router } from "express";

export default function registerUserRoutes(app: Router) {
    const router = Router();

    router.get("/login", (_req, res) => res.send({"response":"User list"}));
    router.post("/delete", (_req, res) => res.send({"response":"Create user"}));

    app.use("/usersesssssws", router);
}