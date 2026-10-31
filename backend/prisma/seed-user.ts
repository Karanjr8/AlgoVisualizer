import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed for users...');

  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminHashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Seed Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@algovis.io' },
    update: {
      role: 'ADMIN',
      fullName: 'System Administrator',
      name: 'System Administrator',
      password: adminHashedPassword,
      isEmailVerified: true,
    },
    create: {
      email: 'admin@algovis.io',
      password: adminHashedPassword,
      fullName: 'System Administrator',
      name: 'System Administrator',
      username: 'admin',
      role: 'ADMIN',
      isEmailVerified: true,
      currentStreak: 15,
      longestStreak: 30,
      learningHours: 120.0,
      xp: 5000,
      level: 10,
    },
  });
  console.log('Admin user created:', admin.email);

  // 2. Seed Regular Dev User
  const user = await prisma.user.upsert({
    where: { email: 'dev@test.com' },
    update: {
      username: 'AlgoMaster99',
      fullName: 'Developer Profile',
      name: 'Developer Profile',
      password: hashedPassword,
      role: 'USER',
      currentStreak: 12,
      learningHours: 45.5,
      xp: 2450,
      level: 5,
      isEmailVerified: true,
    },
    create: {
      email: 'dev@test.com',
      password: hashedPassword,
      fullName: 'Developer Profile',
      name: 'Developer Profile',
      username: 'AlgoMaster99',
      role: 'USER',
      currentStreak: 12,
      longestStreak: 20,
      learningHours: 45.5,
      xp: 2450,
      level: 5,
      isEmailVerified: true,
    },
  });

  console.log('Regular user created:', user.username);

  // Add some achievements
  const ach1 = await prisma.achievement.upsert({
    where: { id: 'ach-1' },
    update: {},
    create: {
      id: 'ach-1',
      title: 'First Algorithm',
      description: 'Learned your first algorithm.',
      icon: 'Trophy',
      xpReward: 100,
      unlockCondition: 'Learn 1 algorithm',
    }
  });

  const ach2 = await prisma.achievement.upsert({
    where: { id: 'ach-2' },
    update: {},
    create: {
      id: 'ach-2',
      title: 'Sorting Apprentice',
      description: 'Completed 3 sorting challenges.',
      icon: 'Medal',
      xpReward: 200,
      unlockCondition: 'Complete 3 sorting challenges',
    }
  });

  const ach3 = await prisma.achievement.upsert({
    where: { id: 'ach-3' },
    update: {},
    create: {
      id: 'ach-3',
      title: 'Graph Explorer',
      description: 'Completed 5 graph challenges.',
      icon: 'Compass',
      xpReward: 300,
      unlockCondition: 'Complete 5 graph challenges',
    }
  });

  // Link achievements to user if they don't have them
  try {
    await prisma.userAchievement.create({
      data: { userId: user.id, achievementId: ach1.id }
    });
    await prisma.userAchievement.create({
      data: { userId: user.id, achievementId: ach2.id }
    });
  } catch(e) {
    console.log('Achievements already linked');
  }

  // Create some practice attempts
  await prisma.practiceAttempt.createMany({
    data: [
      { userId: user.id, mode: 'Timed Challenges', difficulty: 'Easy', score: 850, accuracy: 100, completionTime: 45 },
      { userId: user.id, mode: 'Timed Challenges', difficulty: 'Medium', score: 600, accuracy: 80, completionTime: 120 },
      { userId: user.id, mode: 'Speed Run', difficulty: 'Medium', score: 950, accuracy: 100, completionTime: 30 },
      { userId: user.id, mode: 'Interview Simulator', difficulty: 'Hard', score: 400, accuracy: 60, completionTime: 300 },
      { userId: user.id, mode: 'Debug Challenge', difficulty: 'Easy', score: 1000, accuracy: 100, completionTime: 15 },
    ]
  });

  // Create some user activities
  await prisma.userActivity.createMany({
    data: [
      { userId: user.id, action: 'Completed Timed Challenge', description: 'Score: 850, Accuracy: 100%' },
      { userId: user.id, action: 'Unlocked Achievement', description: 'Sorting Apprentice' },
      { userId: user.id, action: 'Completed Module', description: 'Merge Sort' },
      { userId: user.id, action: 'Started Roadmap Stage', description: 'Advanced Graph Theory' },
    ]
  });

  console.log('Database seeded with realistic user profile data!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
