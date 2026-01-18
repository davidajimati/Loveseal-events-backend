import dns from "dns";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import compression from 'compression';
import registerBillingRoutes from "./api/billing/billing.routes.js";
import registerEmailingRoutes from "./api/emailing/comms.routes.js";
import registerUserRoutes from "./api/userProfileMgt/user.route.js";
import registerAdminRoutes from "./api/admin_console/admin.routes.js";
import registerUserAuthRoutes from "./api/authUser/userAuth.route.js";
import registerAdminAuthRoutes from "./api/authAdmin/adminAuth.route.js";
import registerAccommodationRoutes from "./api/accommodation/accommodation.routes.js";
import type {Request, Response, NextFunction, ErrorRequestHandler} from "express";
import registerEventRoutes from "@api/events/route/events.routes.js";


dotenv.config();
const app = express();

const handleInvalidPayload: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            responseCode: "99",
            responseMsg: "Invalid JSON payload",
            responseData: err.message
        });
    }
};

const corsOptions = {
    origin: "*",
    method: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(express.json());
app.use(compression());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
dns.setDefaultResultOrder("ipv4first");

registerUserRoutes(app);
registerEventRoutes(app);
registerAdminRoutes(app);
registerBillingRoutes(app);
registerUserAuthRoutes(app);
registerEmailingRoutes(app);
registerAdminAuthRoutes(app);
registerAccommodationRoutes(app);

app.use(handleInvalidPayload);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

export default app;
