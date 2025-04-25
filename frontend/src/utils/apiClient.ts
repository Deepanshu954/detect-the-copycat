
/**
 * API client for communicating with the C++ backend
 */

// Backend API URL (configurable via environment variable)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface ComparisonRequest {
  originalText: string;
  comparisonText: string;
}

interface MatchingSegment {
  original: string;
  comparison: string;
}

interface ComparisonResponse {
  similarityScore: number;
  matchingSegments: MatchingSegment[];
}

/**
 * Compare two texts for plagiarism detection
 */
export async function compareTexts(
  originalText: string, 
  comparisonText: string
): Promise<ComparisonResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalText, comparisonText }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error comparing texts:', error);
    // If the backend is unavailable, fall back to the frontend implementation
    console.warn('Falling back to frontend implementation');
    return fallbackCompareTexts(originalText, comparisonText);
  }
}

/**
 * Fallback implementation using the frontend code if the backend is unavailable
 */
async function fallbackCompareTexts(
  originalText: string, 
  comparisonText: string
): Promise<ComparisonResponse> {
  // Import the frontend implementation dynamically
  const { compareTexts, findMatchingSegments } = await import('@/utils/plagiarismUtils');
  
  const similarityScore = compareTexts(originalText, comparisonText);
  const matchingSegments = findMatchingSegments(originalText, comparisonText);
  
  return {
    similarityScore,
    matchingSegments,
  };
}

/**
 * Check if the backend API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
