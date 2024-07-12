import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const queryClient = postgres(
  "postgresql://rajashaheryarahmedkhan:EgeUDy6nc5SB@ep-green-rice-a1tg2fz2.ap-southeast-1.aws.neon.tech/fund_impact?sslmode=require"
);

const db = drizzle(queryClient);

export default db;
