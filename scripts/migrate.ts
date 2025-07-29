import { readFile } from "fs/promises";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

console.log("🔗 Connecting to database...:" + process.env.DATABASE_URL);

async function runStatements(content: string) {
  const statements = content
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      await sql.unsafe(stmt);
      console.log("✅ Ran statement:", stmt.slice(0, 60));
    } catch (err) {
      console.error("❌ Error running statement:", stmt, "\n", err);
    }
  }
}

async function migrate() {
  const createTables = await readFile("scripts/01-create-tables.sql", "utf-8");
  const seedData = await readFile("scripts/02-seed-data.sql", "utf-8");

  console.log("⏳ Creating tables...");
  await runStatements(createTables);

  console.log("⏳ Inserting seed data...");
  await runStatements(seedData);
}

migrate();
