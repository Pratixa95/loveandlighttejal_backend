import app from "./app.js";
import { env } from "./config/env.js";
import { seedRoles } from "./db/seedRoles.js";

const startServer = async () => {
  await seedRoles();

  app.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`);
  });
};

startServer();
