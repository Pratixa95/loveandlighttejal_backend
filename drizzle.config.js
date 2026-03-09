import "dotenv/config";

export default {
  schema: "./src/db/schema",
  out: "./drizzle",

  dialect: "postgresql",

  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
};