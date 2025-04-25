
import { preprocessText } from './textProcessing';

/**
 * Calculates Jaccard similarity between two sets
 */
export function calculateJaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  if (set1.size === 0 && set2.size === 0) return 0;
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Compares two texts and returns similarity score
 */
export function compareTexts(text1: string, text2: string): number {
  const ngrams1 = preprocessText(text1);
  const ngrams2 = preprocessText(text2);
  
  const set1 = new Set(ngrams1);
  const set2 = new Set(ngrams2);
  
  return calculateJaccardSimilarity(set1, set2);
}

/**
 * Find common n-grams between two texts
 */
export function findCommonNgrams(text1: string, text2: string, ngramSize: number = 3): string[] {
  const ngrams1 = preprocessText(text1, ngramSize);
  const ngrams2 = preprocessText(text2, ngramSize);
  
  const set1 = new Set(ngrams1);
  const set2 = new Set(ngrams2);
  
  return [...set1].filter(ngram => set2.has(ngram));
}

/**
 * Find matching text segments between two documents
 */
export function findMatchingSegments(originalText: string, comparisonText: string): Array<{original: string, comparison: string}> {
  // This is a simplified implementation
  // In a real-world scenario, we would use a more sophisticated algorithm
  const commonNgrams = findCommonNgrams(originalText, comparisonText, 4);
  
  // For now, we'll just return the first few common n-grams if they exist
  const matches: Array<{original: string, comparison: string}> = [];
  const maxMatches = Math.min(5, commonNgrams.length);
  
  for (let i = 0; i < maxMatches; i++) {
    // Find the context around the ngram
    const ngram = commonNgrams[i];
    const originalContext = findContext(originalText, ngram);
    const comparisonContext = findContext(comparisonText, ngram);
    
    if (originalContext && comparisonContext) {
      matches.push({
        original: originalContext,
        comparison: comparisonContext
      });
    }
  }
  
  return matches;
}

/**
 * Find context around a string in text
 */
function findContext(text: string, search: string, contextLength: number = 100): string | null {
  const lowerText = text.toLowerCase();
  const lowerSearch = search.toLowerCase();
  const index = lowerText.indexOf(lowerSearch);
  
  if (index === -1) return null;
  
  const start = Math.max(0, index - contextLength / 2);
  const end = Math.min(text.length, index + search.length + contextLength / 2);
  
  return text.substring(start, end);
}

/**
 * Get similarity level description
 */
export function getSimilarityLevel(score: number): {
  level: 'low' | 'medium' | 'high',
  description: string
} {
  if (score < 0.3) {
    return {
      level: 'low',
      description: 'Low similarity detected. The documents appear to be mostly different.'
    };
  } else if (score < 0.6) {
    return {
      level: 'medium',
      description: 'Moderate similarity detected. The documents share some common phrases and content.'
    };
  } else {
    return {
      level: 'high',
      description: 'High similarity detected. The documents contain significant matching content that may indicate plagiarism.'
    };
  }
}
