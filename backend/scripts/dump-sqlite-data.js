const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting SQLite Data Dump ---');
  
  const tables = [
    'user',
    'userEvent',
    'userAchievement',
    'userActivity',
    'userTopicCompletion',
    'userProblemCompletion',
    'userStreak',
    'progress',
    'algorithm',
    'question',
    'roadmapNode',
    'achievement',
    'practiceAttempt',
    'interviewSession',
    'interviewMessage',
    'interviewEvaluation',
    'interviewReport'
  ];

  const dump = {
    exportedAt: new Date().toISOString(),
    source: 'SQLite dev.db',
    tables: {}
  };

  let totalRecords = 0;

  for (const table of tables) {
    if (typeof prisma[table]?.findMany === 'function') {
      const records = await prisma[table].findMany();
      dump.tables[table] = records;
      console.log(`Exported ${records.length} records from ${table}`);
      totalRecords += records.length;
    } else {
      console.warn(`Model ${table} not found on Prisma Client.`);
    }
  }

  const outputPath = path.resolve(__dirname, '../prisma/sqlite_dump.json');
  fs.writeFileSync(outputPath, JSON.stringify(dump, null, 2), 'utf-8');
  console.log(`\nDump completed successfully!`);
  console.log(`Total records exported: ${totalRecords}`);
  console.log(`Saved to: ${outputPath}`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Data dump failed:', err);
  process.exit(1);
});
