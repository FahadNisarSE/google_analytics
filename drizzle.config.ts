import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://rajashaheryarahmedkhan:EgeUDy6nc5SB@ep-green-rice-a1tg2fz2.ap-southeast-1.aws.neon.tech/fund_impact?sslmode=require",
  },
  verbose: true,
  strict: true,
});
