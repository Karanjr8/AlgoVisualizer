import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYNONYMS: Record<string, string> = {
  'dp': 'dynamic programming',
  'bs': 'binary search',
  'bfs': 'breadth first search',
  'dfs': 'depth first search',
  'lru': 'least recently used',
  'bst': 'binary search tree',
  'kmp': 'knuth morris pratt',
  '2 pointer': 'two pointers',
  '2 pointers': 'two pointers',
  'sliding window': 'sliding window', // ensure direct matches work too
  'graph': 'graphs',
  'tree': 'trees'
};

const expandQuery = (query: string): string[] => {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/);
  
  // Create an array of potential search terms
  const terms = new Set<string>();
  terms.add(q);
  
  // If the exact query is a known synonym alias (e.g. "dp")
  if (SYNONYMS[q]) {
    terms.add(SYNONYMS[q]);
  }
  
  // Also check individual tokens
  tokens.forEach(token => {
    if (SYNONYMS[token]) {
      terms.add(SYNONYMS[token]);
    }
  });
  
  return Array.from(terms);
};

const calculateScore = (item: any, term: string, type: string): number => {
  let score = 0;
  const t = term.toLowerCase();
  
  const title = (item.name || item.title || '').toLowerCase();
  const cat = (item.category || item.topic || '').toLowerCase();
  
  // Exact match
  if (title === t) score += 50;
  // Prefix match
  else if (title.startsWith(t)) score += 30;
  // Contains match
  else if (title.includes(t)) score += 20;
  
  // Category match
  if (cat === t) score += 15;
  else if (cat.includes(t)) score += 5;
  
  // Type specific boosts
  if (type === 'Algorithm') score += 5; // Algorithms slightly preferred
  
  return score;
};

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query || query.trim() === '') {
      return res.json([]);
    }

    const searchTerms = expandQuery(query);
    
    // Build an OR condition for all expanded terms
    const buildOr = (fields: string[]) => {
      return {
        OR: searchTerms.map(term => ({
          OR: fields.map(field => ({
            [field]: { contains: term } // SQLite doesn't support insensitive easily without Prisma raw, but contains in Prisma SQLite is case-insensitive by default in newer versions
          }))
        }))
      };
    };

    // Execute queries in parallel
    const [algorithms, questions, roadmapNodes] = await prisma.$transaction([
      prisma.algorithm.findMany({
        where: buildOr(['name', 'category', 'relatedTopics', 'difficulty']),
        take: 10
      }),
      prisma.question.findMany({
        where: buildOr(['title', 'topic', 'pattern', 'tags', 'difficulty']),
        take: 10
      }),
      prisma.roadmapNode.findMany({
        where: buildOr(['title', 'category', 'difficulty']),
        take: 10
      })
    ]);

    // Format and Score Results
    const results: any[] = [];

    algorithms.forEach(algo => {
      const bestScore = Math.max(...searchTerms.map(t => calculateScore(algo, t, 'Algorithm')));
      if (bestScore > 0) {
        results.push({
          id: algo.id,
          type: 'Algorithm',
          title: algo.name,
          subtitle: `${algo.category} • ${algo.difficulty}`,
          url: `/algorithms/${algo.id}`,
          score: bestScore
        });
      }
    });

    questions.forEach(q => {
      const bestScore = Math.max(...searchTerms.map(t => calculateScore(q, t, 'Question')));
      if (bestScore > 0) {
        results.push({
          id: q.id,
          type: 'Practice Question',
          title: q.title,
          subtitle: `${q.topic} • ${q.difficulty}`,
          url: `/practice`, // or /practice/${q.id} if supported
          score: bestScore
        });
      }
    });

    roadmapNodes.forEach(rn => {
      const bestScore = Math.max(...searchTerms.map(t => calculateScore(rn, t, 'Roadmap')));
      if (bestScore > 0) {
        results.push({
          id: rn.id,
          type: 'Roadmap Topic',
          title: rn.title,
          subtitle: `Stage ${rn.recommendedOrder} • ${rn.difficulty}`,
          url: `/roadmap`, 
          score: bestScore
        });
      }
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Group by type for the frontend
    const grouped = results.reduce((acc, curr) => {
      if (!acc[curr.type]) acc[curr.type] = [];
      acc[curr.type].push(curr);
      return acc;
    }, {} as Record<string, any[]>);

    // Format as an array of groups to maintain order
    const formattedGroups = Object.keys(grouped).map(key => ({
      label: key,
      items: grouped[key].slice(0, 5) // max 5 per category
    }));

    // Sort groups so Algorithms usually appear first if they have items
    formattedGroups.sort((a, b) => {
      if (a.label === 'Algorithm') return -1;
      if (b.label === 'Algorithm') return 1;
      return 0;
    });

    res.json(formattedGroups);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error during search' });
  }
};
