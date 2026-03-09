import app from "./app.js";
import { env } from "./config/env.js";
import { seedRoles } from "./db/seedRoles.js";
import adminRoutes from "./modules/admin/admin.routes.js";

// ✅ REGISTER ADMIN ROUTES HERE
app.use("/api/admin", adminRoutes);

const startServer = async () => {
  try {
    await seedRoles();

    app.listen(env.port, () => {
      console.log(`🚀 Server running on http://localhost:${env.port}`);
    });

  } catch (error) {
    console.error("SERVER START ERROR:", error);
  }
};

startServer();