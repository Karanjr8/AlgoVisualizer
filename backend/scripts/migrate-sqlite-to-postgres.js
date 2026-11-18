const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function parseDate(val) {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

async function migrateData() {
  console.log('=====================================================');
  console.log('   AlgoVis SQLite -> PostgreSQL Data Migration Engine');
  console.log('=====================================================\n');

  const dumpPath = path.resolve(__dirname, '../prisma/sqlite_dump.json');
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`Data dump not found at ${dumpPath}. Please run dump-sqlite-data.js first.`);
  }

  const rawDump = fs.readFileSync(dumpPath, 'utf-8');
  const dump = JSON.parse(rawDump);
  const tables = dump.tables || {};

  const summaries = [];

  async function migrateModel(tableName, records, upsertFn) {
    const summary = {
      table: tableName,
      sourceCount: records ? records.length : 0,
      migratedCount: 0,
      destinationCount: 0,
      failedCount: 0,
      status: 'EMPTY',
      errors: [],
    };

    if (!records || records.length === 0) {
      summary.status = 'EMPTY';
      summary.destinationCount = await prisma[tableName].count();
      summaries.push(summary);
      console.log(`[${tableName}] 0 records in source. Skipped.`);
      return;
    }

    console.log(`[${tableName}] Migrating ${records.length} records...`);

    for (const record of records) {
      try {
        await upsertFn(record);
        summary.migratedCount++;
      } catch (err) {
        summary.failedCount++;
        const msg = `Record ID ${record.id || 'N/A'}: ${err.message}`;
        summary.errors.push(msg);
        console.error(`  ❌ Error in ${tableName}:`, msg);
      }
    }

    summary.destinationCount = await prisma[tableName].count();
    summary.status =
      summary.failedCount === 0
        ? 'SUCCESS'
        : summary.migratedCount > 0
        ? 'PARTIAL'
        : 'FAILED';

    summaries.push(summary);
    console.log(
      `  ✔ ${tableName}: ${summary.migratedCount}/${summary.sourceCount} migrated. Current in PostgreSQL: ${summary.destinationCount}`
    );
  }

  // PHASE 1: ROOT ENTITIES
  console.log('\n--- Phase 1: Migrating Root Entities ---');

  await migrateModel('user', tables.user, async (item) => {
    return prisma.user.upsert({
      where: { id: item.id },
      update: {
        email: item.email,
        password: item.password,
        fullName: item.fullName,
        name: item.name,
        username: item.username,
        role: item.role || 'USER',
        avatar: item.avatar,
        bio: item.bio,
        college: item.college,
        degree: item.degree,
        graduationYear: item.graduationYear,
        currentRole: item.currentRole,
        githubUrl: item.githubUrl,
        linkedinUrl: item.linkedinUrl,
        leetcodeUrl: item.leetcodeUrl,
        codeforcesUrl: item.codeforcesUrl,
        codechefUrl: item.codechefUrl,
        gfgUrl: item.gfgUrl,
        portfolioUrl: item.portfolioUrl,
        lastLogin: parseDate(item.lastLogin),
        currentStreak: item.currentStreak ?? 0,
        longestStreak: item.longestStreak ?? 0,
        lastActiveDate: parseDate(item.lastActiveDate),
        completedTopics: item.completedTopics,
        completedProblems: item.completedProblems,
        progressData: item.progressData,
        isEmailVerified: item.isEmailVerified ?? false,
        emailVerificationToken: item.emailVerificationToken,
        resetPasswordToken: item.resetPasswordToken,
        resetPasswordExpires: parseDate(item.resetPasswordExpires),
        learningHours: item.learningHours ?? 0.0,
        xp: item.xp ?? 0,
        level: item.level ?? 1,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
      create: {
        id: item.id,
        email: item.email,
        password: item.password,
        fullName: item.fullName,
        name: item.name,
        username: item.username,
        role: item.role || 'USER',
        avatar: item.avatar,
        bio: item.bio,
        college: item.college,
        degree: item.degree,
        graduationYear: item.graduationYear,
        currentRole: item.currentRole,
        githubUrl: item.githubUrl,
        linkedinUrl: item.linkedinUrl,
        leetcodeUrl: item.leetcodeUrl,
        codeforcesUrl: item.codeforcesUrl,
        codechefUrl: item.codechefUrl,
        gfgUrl: item.gfgUrl,
        portfolioUrl: item.portfolioUrl,
        lastLogin: parseDate(item.lastLogin),
        currentStreak: item.currentStreak ?? 0,
        longestStreak: item.longestStreak ?? 0,
        lastActiveDate: parseDate(item.lastActiveDate),
        completedTopics: item.completedTopics,
        completedProblems: item.completedProblems,
        progressData: item.progressData,
        isEmailVerified: item.isEmailVerified ?? false,
        emailVerificationToken: item.emailVerificationToken,
        resetPasswordToken: item.resetPasswordToken,
        resetPasswordExpires: parseDate(item.resetPasswordExpires),
        learningHours: item.learningHours ?? 0.0,
        xp: item.xp ?? 0,
        level: item.level ?? 1,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
    });
  });

  await migrateModel('achievement', tables.achievement, async (item) => {
    return prisma.achievement.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        icon: item.icon,
        xpReward: item.xpReward,
        unlockCondition: item.unlockCondition,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        icon: item.icon,
        xpReward: item.xpReward,
        unlockCondition: item.unlockCondition,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
    });
  });

  await migrateModel('algorithm', tables.algorithm, async (item) => {
    return prisma.algorithm.upsert({
      where: { id: item.id },
      update: {
        slug: item.slug,
        name: item.name,
        category: item.category,
        difficulty: item.difficulty,
        complexity: item.complexity,
        introduction: item.introduction,
        intuition: item.intuition,
        interviewNotes: item.interviewNotes,
        relatedTopics: item.relatedTopics,
        visualizationType: item.visualizationType,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
      create: {
        id: item.id,
        slug: item.slug,
        name: item.name,
        category: item.category,
        difficulty: item.difficulty,
        complexity: item.complexity,
        introduction: item.introduction,
        intuition: item.intuition,
        interviewNotes: item.interviewNotes,
        relatedTopics: item.relatedTopics,
        visualizationType: item.visualizationType,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
    });
  });

  await migrateModel('question', tables.question, async (item) => {
    return prisma.question.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        difficulty: item.difficulty,
        topic: item.topic,
        pattern: item.pattern,
        statement: item.statement,
        hints: item.hints,
        solution: item.solution,
        expectedComplexity: item.expectedComplexity,
        tags: item.tags,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        difficulty: item.difficulty,
        topic: item.topic,
        pattern: item.pattern,
        statement: item.statement,
        hints: item.hints,
        solution: item.solution,
        expectedComplexity: item.expectedComplexity,
        tags: item.tags,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
    });
  });

  await migrateModel('roadmapNode', tables.roadmapNode, async (item) => {
    return prisma.roadmapNode.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
        estimatedTime: item.estimatedTime,
        description: item.description,
        recommendedOrder: item.recommendedOrder,
        prerequisites: item.prerequisites,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
      create: {
        id: item.id,
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
        estimatedTime: item.estimatedTime,
        description: item.description,
        recommendedOrder: item.recommendedOrder,
        prerequisites: item.prerequisites,
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
    });
  });

  // PHASE 2: USER DEPENDENT ENTITIES
  console.log('\n--- Phase 2: Migrating User Dependent Entities ---');

  await migrateModel('userEvent', tables.userEvent, async (item) => {
    return prisma.userEvent.upsert({
      where: { id: item.id },
      update: {
        userId: item.userId,
        eventType: item.eventType,
        topic: item.topic,
        details: item.details,
        timestamp: parseDate(item.timestamp) || new Date(),
      },
      create: {
        id: item.id,
        userId: item.userId,
        eventType: item.eventType,
        topic: item.topic,
        details: item.details,
        timestamp: parseDate(item.timestamp) || new Date(),
      },
    });
  });

  await migrateModel('userAchievement', tables.userAchievement, async (item) => {
    return prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId: item.userId,
          achievementId: item.achievementId,
        },
      },
      update: {
        unlockedAt: parseDate(item.unlockedAt) || new Date(),
      },
      create: {
        id: item.id,
        userId: item.userId,
        achievementId: item.achievementId,
        unlockedAt: parseDate(item.unlockedAt) || new Date(),
      },
    });
  });

  await migrateModel('userActivity', tables.userActivity, async (item) => {
    return prisma.userActivity.upsert({
      where: { id: item.id },
      update: {
        userId: item.userId,
        action: item.action,
        description: item.description,
        topicId: item.topicId,
        problemId: item.problemId,
        duration: item.duration ?? 0,
        timestamp: parseDate(item.timestamp) || new Date(),
      },
      create: {
        id: item.id,
        userId: item.userId,
        action: item.action,
        description: item.description,
        topicId: item.topicId,
        problemId: item.problemId,
        duration: item.duration ?? 0,
        timestamp: parseDate(item.timestamp) || new Date(),
      },
    });
  });

  await migrateModel('userStreak', tables.userStreak, async (item) => {
    return prisma.userStreak.upsert({
      where: { userId: item.userId },
      update: {
        currentStreak: item.currentStreak ?? 0,
        longestStreak: item.longestStreak ?? 0,
        activeDaysThisMonth: item.activeDaysThisMonth ?? 0,
        activeDaysThisYear: item.activeDaysThisYear ?? 0,
        totalActiveDays: item.totalActiveDays ?? 0,
        lastActiveDate: parseDate(item.lastActiveDate),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
      create: {
        id: item.id,
        userId: item.userId,
        currentStreak: item.currentStreak ?? 0,
        longestStreak: item.longestStreak ?? 0,
        activeDaysThisMonth: item.activeDaysThisMonth ?? 0,
        activeDaysThisYear: item.activeDaysThisYear ?? 0,
        totalActiveDays: item.totalActiveDays ?? 0,
        lastActiveDate: parseDate(item.lastActiveDate),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
    });
  });

  await migrateModel('userTopicCompletion', tables.userTopicCompletion, async (item) => {
    return prisma.userTopicCompletion.upsert({
      where: {
        userId_topicId: {
          userId: item.userId,
          topicId: item.topicId,
        },
      },
      update: {
        completedAt: parseDate(item.completedAt) || new Date(),
      },
      create: {
        id: item.id,
        userId: item.userId,
        topicId: item.topicId,
        completedAt: parseDate(item.completedAt) || new Date(),
      },
    });
  });

  await migrateModel('userProblemCompletion', tables.userProblemCompletion, async (item) => {
    return prisma.userProblemCompletion.upsert({
      where: {
        userId_problemId: {
          userId: item.userId,
          problemId: item.problemId,
        },
      },
      update: {
        score: item.score ?? 0,
        completedAt: parseDate(item.completedAt) || new Date(),
      },
      create: {
        id: item.id,
        userId: item.userId,
        problemId: item.problemId,
        score: item.score ?? 0,
        completedAt: parseDate(item.completedAt) || new Date(),
      },
    });
  });

  await migrateModel('progress', tables.progress, async (item) => {
    return prisma.progress.upsert({
      where: {
        userId_algorithmId: {
          userId: item.userId,
          algorithmId: item.algorithmId,
        },
      },
      update: {
        completed: item.completed ?? false,
        score: item.score ?? 0,
        lastAccessed: parseDate(item.lastAccessed) || new Date(),
      },
      create: {
        id: item.id,
        userId: item.userId,
        algorithmId: item.algorithmId,
        completed: item.completed ?? false,
        score: item.score ?? 0,
        lastAccessed: parseDate(item.lastAccessed) || new Date(),
      },
    });
  });

  await migrateModel('practiceAttempt', tables.practiceAttempt, async (item) => {
    return prisma.practiceAttempt.upsert({
      where: { id: item.id },
      update: {
        userId: item.userId,
        mode: item.mode,
        difficulty: item.difficulty,
        score: item.score,
        accuracy: item.accuracy,
        completionTime: item.completionTime,
        createdAt: parseDate(item.createdAt) || new Date(),
      },
      create: {
        id: item.id,
        userId: item.userId,
        mode: item.mode,
        difficulty: item.difficulty,
        score: item.score,
        accuracy: item.accuracy,
        completionTime: item.completionTime,
        createdAt: parseDate(item.createdAt) || new Date(),
      },
    });
  });

  // PHASE 3: INTERVIEW SESSIONS
  console.log('\n--- Phase 3: Migrating Interview Sessions ---');

  await migrateModel('interviewSession', tables.interviewSession, async (item) => {
    return prisma.interviewSession.upsert({
      where: { id: item.id },
      update: {
        userId: item.userId,
        role: item.role,
        difficulty: item.difficulty,
        interviewStyle: item.interviewStyle,
        selectedTopics: item.selectedTopics,
        enabledFeatures: item.enabledFeatures,
        status: item.status || 'IN_PROGRESS',
        turnCount: item.turnCount ?? 0,
        maxTurns: item.maxTurns ?? 8,
        timeLimitPerQuestion: item.timeLimitPerQuestion ?? 0,
        startedAt: parseDate(item.startedAt) || new Date(),
        completedAt: parseDate(item.completedAt),
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
      create: {
        id: item.id,
        userId: item.userId,
        role: item.role,
        difficulty: item.difficulty,
        interviewStyle: item.interviewStyle,
        selectedTopics: item.selectedTopics,
        enabledFeatures: item.enabledFeatures,
        status: item.status || 'IN_PROGRESS',
        turnCount: item.turnCount ?? 0,
        maxTurns: item.maxTurns ?? 8,
        timeLimitPerQuestion: item.timeLimitPerQuestion ?? 0,
        startedAt: parseDate(item.startedAt) || new Date(),
        completedAt: parseDate(item.completedAt),
        createdAt: parseDate(item.createdAt) || new Date(),
        updatedAt: parseDate(item.updatedAt) || new Date(),
      },
    });
  });

  // PHASE 4: INTERVIEW DEPENDENT ENTITIES
  console.log('\n--- Phase 4: Migrating Interview Dependent Entities ---');

  await migrateModel('interviewMessage', tables.interviewMessage, async (item) => {
    return prisma.interviewMessage.upsert({
      where: { id: item.id },
      update: {
        sessionId: item.sessionId,
        sequenceNumber: item.sequenceNumber,
        sender: item.sender,
        content: item.content,
        questionTopic: item.questionTopic,
        questionType: item.questionType,
        timeSpentSeconds: item.timeSpentSeconds,
        timedOut: item.timedOut ?? false,
        createdAt: parseDate(item.createdAt) || new Date(),
      },
      create: {
        id: item.id,
        sessionId: item.sessionId,
        sequenceNumber: item.sequenceNumber,
        sender: item.sender,
        content: item.content,
        questionTopic: item.questionTopic,
        questionType: item.questionType,
        timeSpentSeconds: item.timeSpentSeconds,
        timedOut: item.timedOut ?? false,
        createdAt: parseDate(item.createdAt) || new Date(),
      },
    });
  });

  await migrateModel('interviewEvaluation', tables.interviewEvaluation, async (item) => {
    return prisma.interviewEvaluation.upsert({
      where: { id: item.id },
      update: {
        sessionId: item.sessionId,
        messageId: item.messageId,
        questionText: item.questionText,
        candidateAnswer: item.candidateAnswer,
        dimension: item.dimension,
        score: item.score,
        rationale: item.rationale,
        evidence: item.evidence,
        createdAt: parseDate(item.createdAt) || new Date(),
      },
      create: {
        id: item.id,
        sessionId: item.sessionId,
        messageId: item.messageId,
        questionText: item.questionText,
        candidateAnswer: item.candidateAnswer,
        dimension: item.dimension,
        score: item.score,
        rationale: item.rationale,
        evidence: item.evidence,
        createdAt: parseDate(item.createdAt) || new Date(),
      },
    });
  });

  await migrateModel('interviewReport', tables.interviewReport, async (item) => {
    return prisma.interviewReport.upsert({
      where: { sessionId: item.sessionId },
      update: {
        overallScore: item.overallScore,
        performanceGrade: item.performanceGrade,
        summary: item.summary,
        strengths: item.strengths,
        improvementAreas: item.improvementAreas,
        dimensionScores: item.dimensionScores,
        topicScores: item.topicScores,
        questionReviews: item.questionReviews,
        recommendations: item.recommendations,
        actionablePlan: item.actionablePlan,
        interviewerFeedback: item.interviewerFeedback,
        createdAt: parseDate(item.createdAt) || new Date(),
      },
      create: {
        id: item.id,
        sessionId: item.sessionId,
        overallScore: item.overallScore,
        performanceGrade: item.performanceGrade,
        summary: item.summary,
        strengths: item.strengths,
        improvementAreas: item.improvementAreas,
        dimensionScores: item.dimensionScores,
        topicScores: item.topicScores,
        questionReviews: item.questionReviews,
        recommendations: item.recommendations,
        actionablePlan: item.actionablePlan,
        interviewerFeedback: item.interviewerFeedback,
        createdAt: parseDate(item.createdAt) || new Date(),
      },
    });
  });

  // MIGRATION SUMMARY
  console.log('\n=====================================================');
  console.log('            DATA MIGRATION SUMMARY REPORT');
  console.log('=====================================================');

  let grandSource = 0;
  let grandMigrated = 0;
  let grandDest = 0;
  let grandFailed = 0;

  console.log(
    'Table Name'.padEnd(25) +
      'Source'.padStart(8) +
      'Migrated'.padStart(10) +
      'Postgres'.padStart(10) +
      'Failed'.padStart(8) +
      '  Status'
  );
  console.log('-'.repeat(69));

  for (const s of summaries) {
    grandSource += s.sourceCount;
    grandMigrated += s.migratedCount;
    grandDest += s.destinationCount;
    grandFailed += s.failedCount;

    console.log(
      s.table.padEnd(25) +
        s.sourceCount.toString().padStart(8) +
        s.migratedCount.toString().padStart(10) +
        s.destinationCount.toString().padStart(10) +
        s.failedCount.toString().padStart(8) +
        '  ' +
        s.status
    );
  }

  console.log('-'.repeat(69));
  console.log(
    'TOTAL'.padEnd(25) +
      grandSource.toString().padStart(8) +
      grandMigrated.toString().padStart(10) +
      grandDest.toString().padStart(10) +
      grandFailed.toString().padStart(8)
  );
  console.log('=====================================================\n');

  if (grandFailed > 0) {
    console.warn(`⚠ ${grandFailed} records encountered errors during migration. Please review the log above.`);
  } else {
    console.log('🎉 100% of SQLite data was successfully transferred to PostgreSQL with zero errors!');
  }

  await prisma.$disconnect();
}

migrateData().catch((err) => {
  console.error('Migration aborted:', err);
  process.exit(1);
});
