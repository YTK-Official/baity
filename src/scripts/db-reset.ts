import { db } from '@/db';
import { sql } from 'drizzle-orm';

async function resetDatabase() {
  const tables = await db
    .execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`)
    .then(({ rows }) => rows.map((row) => row.table_name));

  await Promise.all(
    tables.map((tableName) => {
      // Optionally skip system tables
      if (tableName === 'drizzle_migrations') return Promise.resolve();
      // Directly interpolate table name (safe here because table names are from information_schema)
      return db.execute(sql.raw(`TRUNCATE TABLE "${tableName}" CASCADE`));
    }),
  );

  console.log('Database reset successfully.');
}

resetDatabase().catch((error) => {
  console.error('Failed to reset the database:', error);
});
