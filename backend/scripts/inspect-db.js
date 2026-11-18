const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const models = [
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

  const counts = {};
  for (const m of models) {
    if (prisma[m]) {
      counts[m] = await prisma[m].count();
    }
  }
  console.log(JSON.stringify(counts, null, 2));
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
