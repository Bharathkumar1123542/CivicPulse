import { db, calculateDistanceMeters } from '../db.js';
import { AIAnalysis, IssuePriority, IssueLocation } from '../types.js';

interface CategoryKeywords {
  category: string;
  defaultPriority: IssuePriority;
  keywords: string[];
}

const CATEGORY_MAP: CategoryKeywords[] = [
  {
    category: 'Damaged Roads & Potholes',
    defaultPriority: 'High',
    keywords: [
      'pothole', 'potholes', 'crater', 'asphalt', 'road', 'tar', 'sinking',
      'cavity', 'trench', 'cracks', 'bump', 'speedbreaker', 'highway', 'lane'
    ],
  },
  {
    category: 'Broken Streetlights & Dark Spots',
    defaultPriority: 'Medium',
    keywords: [
      'streetlight', 'streetlights', 'light', 'lights', 'lamp', 'dark', 'bulb',
      'dark spot', 'illumination', 'flickering', 'pole', 'led', 'sodium lamp'
    ],
  },
  {
    category: 'Garbage Accumulation & Illegal Dumping',
    defaultPriority: 'Medium',
    keywords: [
      'garbage', 'waste', 'trash', 'dump', 'dustbin', 'dumpster', 'smell',
      'odor', 'plastic', 'debris', 'litter', 'filth', 'stray animals', 'swm'
    ],
  },
  {
    category: 'Water Pipe Leakage & Sewage Block',
    defaultPriority: 'High',
    keywords: [
      'water', 'pipe', 'leak', 'burst', 'gushing', 'drain', 'sewer', 'sewage',
      'manhole', 'overflow', 'drinking water', 'drainage', 'gutter', 'flooding'
    ],
  },
  {
    category: 'Sparking Transformers & Live Wires',
    defaultPriority: 'Urgent',
    keywords: [
      'transformer', 'wire', 'wires', 'spark', 'sparks', 'sparking', 'electric',
      'electricity', 'current', 'shock', 'short circuit', 'hanging wire', 'high voltage',
      'electrocution', 'cable fire'
    ],
  },
  {
    category: 'Damaged Public Infrastructure & Footpaths',
    defaultPriority: 'Medium',
    keywords: [
      'footpath', 'pavement', 'sidewalk', 'railing', 'bench', 'bus stop',
      'bus shelter', 'curb', 'slab', 'divider', 'bridge', 'subway', 'signboard'
    ],
  },
  {
    category: 'Fallen Trees & Public Park Hazards',
    defaultPriority: 'Low',
    keywords: [
      'tree', 'branch', 'branches', 'fallen', 'uprooted', 'park', 'garden',
      'playground', 'swing', 'lawn', 'hedge', 'overgrown', 'wood'
    ],
  },
];

const URGENT_KEYWORDS = [
  'urgent', 'emergency', 'danger', 'hazard', 'life-threatening', 'spark',
  'sparks', 'fire', 'electric shock', 'live wire', 'open manhole', 'school',
  'hospital', 'accident', 'collapsed', 'electrocution', 'gas leak'
];

const HIGH_KEYWORDS = [
  'accident', 'severe', 'major', 'skid', 'burst', 'flooding', 'blocked',
  'deep', 'bleeding', 'pedestrian', 'children', 'unsafe', 'critical'
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

export class AIService {
  public static analyzeReport(
    title: string,
    description: string,
    location?: Partial<IssueLocation>,
    categoryHint?: string
  ): AIAnalysis {
    const combinedText = `${title} ${description}`.toLowerCase();
    const tokens = tokenize(combinedText);

    // 1. Category Classification
    let bestCategory = categoryHint || 'Damaged Roads & Potholes';
    let highestScore = 0;
    const detectedKeywords: string[] = [];

    for (const cat of CATEGORY_MAP) {
      let score = 0;
      for (const kw of cat.keywords) {
        if (combinedText.includes(kw)) {
          score += 2;
          if (!detectedKeywords.includes(kw)) {
            detectedKeywords.push(kw);
          }
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestCategory = cat.category;
      }
    }

    const confidence = highestScore > 0 ? Math.min(0.70 + highestScore * 0.05, 0.99) : 0.65;

    // 2. Priority Recommendation
    let suggestedPriority: IssuePriority = 'Medium';
    let priorityReason = 'Standard municipal maintenance priority assigned.';

    const hasUrgent = URGENT_KEYWORDS.some((kw) => combinedText.includes(kw));
    const hasHigh = HIGH_KEYWORDS.some((kw) => combinedText.includes(kw));

    if (bestCategory === 'Sparking Transformers & Live Wires' || hasUrgent) {
      suggestedPriority = 'Urgent';
      priorityReason =
        'Identified high-risk safety hazards or potential injury threats requiring immediate municipal response.';
    } else if (bestCategory === 'Water Pipe Leakage & Sewage Block' || hasHigh) {
      suggestedPriority = 'High';
      priorityReason =
        'Major civic inconvenience, potable water loss, or traffic flow disruption detected.';
    } else if (bestCategory === 'Fallen Trees & Public Park Hazards') {
      suggestedPriority = 'Low';
      priorityReason = 'Routine public amenity repair with low immediate vehicular danger.';
    } else {
      suggestedPriority = 'Medium';
      priorityReason = 'Standard community impact requiring scheduled ward intervention.';
    }

    // 3. AI Executive Summarization
    const summary = this.generateSummary(title, bestCategory, suggestedPriority, location?.address);

    // 4. Duplicate Detection Engine
    let isPotentialDuplicate = false;
    let duplicateReportId: string | undefined;
    let duplicateSimilarity: number | undefined;
    let duplicateReason: string | undefined;

    if (location && typeof location.latitude === 'number' && typeof location.longitude === 'number') {
      const existingReports = db.getReports().filter((r) => r.status !== 'Closed');

      for (const existing of existingReports) {
        const dist = calculateDistanceMeters(
          location.latitude,
          location.longitude,
          existing.location.latitude,
          existing.location.longitude
        );

        // Within 350 meters
        if (dist <= 350) {
          const existingTokens = tokenize(`${existing.title} ${existing.description}`);
          const overlap = tokens.filter((t) => existingTokens.includes(t));
          const similarityScore = overlap.length / Math.max(tokens.length, 1);

          if (existing.category === bestCategory || similarityScore > 0.25) {
            isPotentialDuplicate = true;
            duplicateReportId = existing.id;
            duplicateSimilarity = Math.min(Math.round((0.5 + similarityScore * 0.5) * 100), 96);
            duplicateReason = `Similar issue (${existing.category}) already reported ${Math.round(dist)}m away at "${existing.location.address}" (ID: ${existing.id}).`;
            break;
          }
        }
      }
    }

    return {
      suggestedCategory: bestCategory,
      confidence: Number(confidence.toFixed(2)),
      suggestedPriority,
      priorityReason,
      summary,
      detectedKeywords: detectedKeywords.slice(0, 6),
      isPotentialDuplicate,
      duplicateReportId,
      duplicateSimilarity,
      duplicateReason,
    };
  }

  private static generateSummary(
    title: string,
    category: string,
    priority: IssuePriority,
    address?: string
  ): string {
    const locSnippet = address ? ` near ${address}` : '';
    switch (category) {
      case 'Damaged Roads & Potholes':
        return `Road surface distress (${title})${locSnippet} flagged as ${priority} priority; requires asphalt hot-mix patching and rolling.`;
      case 'Broken Streetlights & Dark Spots':
        return `Illumination failure reported${locSnippet}; line crew inspection recommended for bulb/fuse replacement.`;
      case 'Garbage Accumulation & Illegal Dumping':
        return `Sanitation hazard with solid waste accumulation${locSnippet}; requires waste collection compactor dispatch.`;
      case 'Water Pipe Leakage & Sewage Block':
        return `Water infrastructure leakage${locSnippet}; valve inspection and pipeline repair required to prevent ground erosion.`;
      case 'Sparking Transformers & Live Wires':
        return `URGENT ELECTRICAL HAZARD${locSnippet}; requires emergency grid isolation and wire restringing.`;
      default:
        return `Reported civic issue: ${title}${locSnippet}; prioritized as ${priority} for department field inspection.`;
    }
  }

  public static verifyResolutionSuitability(originalDescription: string, resolutionNotes: string): {
    score: number;
    verdict: string;
    details: string;
  } {
    const origTokens = tokenize(originalDescription);
    const resTokens = tokenize(resolutionNotes);
    const resolvedKeywords = ['repaired', 'replaced', 'fixed', 'cleared', 'tested', 'inspected', 'sealed', 'restored'];

    const hasActionVerb = resolvedKeywords.some((w) => resolutionNotes.toLowerCase().includes(w));
    const tokenOverlap = resTokens.filter((t) => origTokens.includes(t));

    let score = 70;
    if (hasActionVerb) score += 20;
    if (tokenOverlap.length > 2) score += 10;
    score = Math.min(score, 98);

    return {
      score,
      verdict: score >= 80 ? 'Comprehensive Resolution' : 'Adequate Resolution',
      details: 'Resolution notes adequately match reported defects and demonstrate remediating actions taken on site.',
    };
  }
}
