import dns from "dns";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { swaggerSpec } from "./swagger.js"
import swaggerUi from "swagger-ui-express";
import compression from "compression";
import registerBillingRoutes from "./api/billing/route/billing.routes.js";
import registerEmailingRoutes from "./api/emailing/comms.routes.js";
import registerUserRoutes from "./api/userProfileMgt/user.route.js";
import registerAdminRoutes from "@api/adminConsole/adminProfileMgt/admin.route.js"
import registerUserAuthRoutes from "./api/authUser/userAuth.route.js";
import registerAdminAuthRoutes from "./api/authAdmin/adminAuth.route.js";
import registerAccommodationRoutes from "./api/accommodation/route/accommodation.routes.js";
import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import registerEventRoutes from "@api/events/route/events.routes.js";
import registerEventRegistrationRoutes from "@api/events/route/event-registration.routes.js";
import registerAllocationRoutes from "./api/accommodation/route/allocation.routes.js";
import userDashboardRoutes from "@api/userDashboard/user.dashboard.route.js";


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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

registerUserRoutes(app);
registerAdminRoutes(app);
registerEventRoutes(app);
userDashboardRoutes(app);
registerAdminRoutes(app);
registerBillingRoutes(app);
registerUserAuthRoutes(app);
registerEmailingRoutes(app);
registerAdminAuthRoutes(app);
registerAccommodationRoutes(app);
registerAllocationRoutes(app)
registerEventRegistrationRoutes(app);

app.use(handleInvalidPayload);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

export default app;
