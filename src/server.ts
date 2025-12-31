import express from "express";
import registerUserRoutes from "./api/user_mgt/user.route.js"
import registerUserAuthRoutes from "./api/user_auth/userAuth.route.js";
import registerCommsRoutes from "./api/comms_mgt/comms.routes.js";
import registerEventRoutes from "./api/events_mgt/events.routes.js";
import registerBillingRoutes from "./api/billing/billing.routes.js";
import registerAdminRoutes from "./api/admin_console/admin.routes.js";
import registerAccommodationRoutes from "./api/accommodation/accommodation.routes.js";

const app = express();

registerUserRoutes(app);
registerCommsRoutes(app);
registerEventRoutes(app);
registerAdminRoutes(app);
registerBillingRoutes(app);
registerUserAuthRoutes(app)
registerAccommodationRoutes(app);

export default app;