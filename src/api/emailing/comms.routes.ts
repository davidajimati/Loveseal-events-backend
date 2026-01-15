import { Router } from "express";

export default function registerEmailingRoutes(app: Router) {
    const router = Router();

    router.post("/", ) ;
    router.post("/", (_req, res) => res.send("Create user"));

    app.use("/user-auth", router);
}