import { db } from '@/db';
import { sql } from 'drizzle-orm';

async function dropDatabaseTables() {
  await db.execute(sql`DROP SCHEMA public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);

  console.log('Database reset and seeded successfully.');
}

dropDatabaseTables().catch((error) => {
  console.error('Failed to reset the database:', error);
});
