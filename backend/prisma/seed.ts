import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Seed Algorithms
  const algorithms = [
    {
      slug: 'bubble-sort',
      name: 'Bubble Sort',
      category: 'Sorting',
      difficulty: 'Easy',
      complexity: '{"time": "O(N²)", "space": "O(1)"}',
      introduction: 'A simple sorting algorithm that repeatedly steps through the list...',
      intuition: 'Imagine bubbles rising to the surface. The largest elements "bubble up" to the end of the array.',
      interviewNotes: 'Rarely asked directly, but useful to explain why better algorithms exist.',
      relatedTopics: '["Arrays", "Sorting"]',
      visualizationType: 'array'
    },
    {
      slug: 'binary-search',
      name: 'Binary Search',
      category: 'Searching',
      difficulty: 'Easy',
      complexity: '{"time": "O(log N)", "space": "O(1)"}',
      introduction: 'A search algorithm that finds the position of a target value within a sorted array.',
      intuition: 'Like searching a dictionary. Open to the middle, decide left or right, and repeat.',
      interviewNotes: 'Fundamental. You must be able to write this bug-free in 2 minutes.',
      relatedTopics: '["Arrays", "Searching", "Divide and Conquer"]',
      visualizationType: 'array'
    }
  ];

  for (const algo of algorithms) {
    await prisma.algorithm.upsert({
      where: { slug: algo.slug },
      update: {},
      create: algo,
    });
  }

  // 2. Seed Questions
  const questions = [
    {
      title: 'Binary Search',
      difficulty: 'Easy',
      topic: 'Searching',
      pattern: 'Binary Search',
      statement: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
      hints: '["Check the middle element", "Adjust left and right bounds"]',
      solution: 'function search(nums, target) { ... }',
      expectedComplexity: 'O(log N)',
      tags: '["Array", "Binary Search"]'
    },
    {
      title: 'Two Sum II',
      difficulty: 'Medium',
      topic: 'Arrays',
      pattern: 'Two Pointers',
      statement: 'Given a 1-indexed array of integers sorted in non-decreasing order, find two numbers such that they add up to a specific target.',
      hints: '["Use two pointers at opposite ends", "Move pointers based on sum"]',
      solution: 'function twoSum(nums, target) { ... }',
      expectedComplexity: 'O(N)',
      tags: '["Array", "Two Pointers"]'
    }
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: q
    });
  }

  // 3. Seed Roadmap
  const roadmapNodes = [
    {
      title: 'Arrays & Hashing',
      category: 'Data Structures',
      difficulty: 'Beginner',
      estimatedTime: '2 weeks',
      description: 'The foundation of data structures. Learn memory allocation and hash maps.',
      recommendedOrder: 1,
      prerequisites: '[]'
    },
    {
      title: 'Two Pointers',
      category: 'Algorithms',
      difficulty: 'Beginner',
      estimatedTime: '1 week',
      description: 'Optimize nested loops to linear time by iterating from two ends.',
      recommendedOrder: 2,
      prerequisites: '["Arrays & Hashing"]'
    }
  ];

  for (const node of roadmapNodes) {
    await prisma.roadmapNode.create({
      data: node
    });
  }

  // 4. Seed Achievements
  const achievements = [
    {
      title: 'First Blood',
      description: 'Complete your very first algorithmic challenge.',
      icon: 'Sword',
      xpReward: 100,
      unlockCondition: 'SOLVED_1_QUESTION'
    },
    {
      title: 'Master of Trees',
      description: 'Solve 10 Tree traversal questions.',
      icon: 'TreePine',
      xpReward: 500,
      unlockCondition: 'SOLVED_10_TREES'
    }
  ];

  for (const ach of achievements) {
    await prisma.achievement.create({
      data: ach
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
