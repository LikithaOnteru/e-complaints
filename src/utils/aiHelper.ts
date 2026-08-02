import { CategoryType, PriorityType, Complaint } from '../types';

interface AICategoryResult {
  suggestedCategory: CategoryType;
  confidence: number;
  reasoning: string;
}

interface AIPriorityResult {
  suggestedPriority: PriorityType;
  reasons: string[];
}

export function detectAICategory(description: string, title: string = ''): AICategoryResult {
  const combined = (title + ' ' + description).toLowerCase();

  if (combined.match(/pothole|road|asphalt|highway|street|bridge|culvert|cave-in|tar|pathway|muddy road|dirt road|trench/i)) {
    return {
      suggestedCategory: 'Road Damage',
      confidence: 94,
      reasoning: 'Detected road infrastructure terms (pothole, asphalt, street, pathway, trench).',
    };
  }

  if (combined.match(/drain|drainage|sewage|choked|overflow|gutter|flooding|wastewater|stagnant water|mud drain|clog/i)) {
    return {
      suggestedCategory: 'Drainage',
      confidence: 92,
      reasoning: 'Detected drainage and wastewater keywords (drain, sewage, choked, gutter, flooding).',
    };
  }

  if (combined.match(/water|pipeline|leak|leakage|handpump|borewell|water tank|drinking water|tap|pressure|contamination|water supply/i)) {
    return {
      suggestedCategory: 'Water Supply',
      confidence: 96,
      reasoning: 'Detected water resource terms (water, pipeline, handpump, leakage, tap, borewell).',
    };
  }

  if (combined.match(/light|streetlight|lamp|solar light|led|bulb|dark|strobe|flicker|night/i)) {
    return {
      suggestedCategory: 'Street Light',
      confidence: 91,
      reasoning: 'Detected illumination keywords (streetlight, lamp, bulb, solar light, dark road).',
    };
  }

  if (combined.match(/garbage|trash|waste|dustbin|dump|dumping|polythene|plastic|carcass|haat waste|litter/i)) {
    return {
      suggestedCategory: 'Garbage',
      confidence: 93,
      reasoning: 'Detected municipal solid waste keywords (garbage, trash, waste, dumping, dustbin).',
    };
  }

  if (combined.match(/electric|wire|cable|transformer|voltage|sparking|shock|electrocution|current|power|substation|pole|fluctuation/i)) {
    return {
      suggestedCategory: 'Electricity',
      confidence: 95,
      reasoning: 'Detected electrical grid & safety keywords (electric, transformer, wire, voltage, power).',
    };
  }

  if (combined.match(/toilet|sanitation|clean|cleaning|mosquito|larvae|bleaching|fogging|disinfection|odor|smell/i)) {
    return {
      suggestedCategory: 'Sanitation',
      confidence: 90,
      reasoning: 'Detected public hygiene & sanitation terms (toilet, mosquito, cleaning, disinfection).',
    };
  }

  return {
    suggestedCategory: 'Others',
    confidence: 70,
    reasoning: 'General civic request requiring municipal review.',
  };
}

export function detectAIPriority(description: string, title: string = ''): AIPriorityResult {
  const combined = (title + ' ' + description).toLowerCase();
  const HighKeywords = [
    'accident', 'death', 'injury', 'danger', 'shock', 'sparking', 'live wire',
    'electrocution', 'burst', 'flood', 'flooding', 'school', 'hospital',
    'child', 'children', 'poison', 'contamination', 'emergency', 'fallen pole',
    'collapsed', 'cave-in', 'unconscious', 'urgent', 'fire', 'hazard'
  ];

  const MediumKeywords = [
    'overflow', 'choked', 'stagnant', 'odour', 'smell', 'mosquito', 'leakage',
    'dark', 'darkness', 'inconvenience', 'blockage', 'pothole', 'broken', 'low voltage'
  ];

  const matchedHigh = HighKeywords.filter(k => combined.includes(k));
  const matchedMedium = MediumKeywords.filter(k => combined.includes(k));

  if (matchedHigh.length > 0) {
    return {
      suggestedPriority: 'High',
      reasons: matchedHigh.map(k => `Critical safety trigger keyword: "${k}"`),
    };
  }

  if (matchedMedium.length > 0) {
    return {
      suggestedPriority: 'Medium',
      reasons: matchedMedium.map(k => `Moderate impact keyword: "${k}"`),
    };
  }

  return {
    suggestedPriority: 'Low',
    reasons: ['Standard routine maintenance issue'],
  };
}

export function checkSmartDuplicate(
  title: string,
  description: string,
  village: string,
  existingComplaints: Complaint[]
): Complaint | null {
  if (!village || (!title && !description)) return null;

  const currentWords = (title + ' ' + description)
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(w => w.length > 3);

  if (currentWords.length < 2) return null;

  for (const c of existingComplaints) {
    if (c.village.toLowerCase() === village.toLowerCase() && c.status !== 'Resolved' && c.status !== 'Rejected') {
      const existingWords = (c.title + ' ' + c.description)
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(w => w.length > 3);

      const intersection = currentWords.filter(w => existingWords.includes(w));
      const overlapScore = intersection.length / Math.min(currentWords.length, existingWords.length);

      if (overlapScore >= 0.4 || (c.category && currentWords.some(w => c.title.toLowerCase().includes(w)))) {
        return c;
      }
    }
  }

  return null;
}
