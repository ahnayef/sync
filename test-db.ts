import { config } from "dotenv";
config();
import mysql from "mysql2/promise";

async function run() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  try {
    const [logs] = await connection.execute(`
      SELECT l.id, l.program_id, p.name as program_name, d.name as department_name, l.status, l.message, l.created_at
      FROM sheet_sync_logs l
      JOIN programs p ON l.program_id = p.id
      JOIN departments d ON p.department_id = d.id
      ORDER BY l.created_at DESC
      LIMIT 100
    `);
    console.log("Success logs length:", (logs as any).length);
  } catch (err: any) {
    console.error("Error logs:", err.message);
  }
  process.exit(0);
}
run();
