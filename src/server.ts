import express from "express";
import registerUserRoutes from "./api/user_mgt/user.route.js"
import registerUserAuthRoutes from "./api/authUser/userAuth.route.js";
import registerEmailingRoutes from "./api/emailing/comms.routes.js";
import registerEventRoutes from "./api/events/events.routes.js";
import registerBillingRoutes from "./api/billing/billing.routes.js";
import registerAdminRoutes from "./api/admin_console/admin.routes.js";
import registerAccommodationRoutes from "./api/accommodation/accommodation.routes.js";
import registerAdminAuthRoutes from "./api/authAdmin/adminAuth.route.js";

const app = express();

registerUserRoutes(app);
registerEventRoutes(app);
registerAdminRoutes(app);
registerBillingRoutes(app);
registerUserAuthRoutes(app);
registerEmailingRoutes(app);
registerAdminAuthRoutes(app);
registerAccommodationRoutes(app);

export default app;