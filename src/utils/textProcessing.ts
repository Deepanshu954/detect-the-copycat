
// Common stopwords in English
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
  'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 
  'about', 'against', 'between', 'into', 'through', 'during', 'before', 
  'after', 'above', 'below', 'from', 'up', 'down', 'of', 'off', 'over', 
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 
  'same', 'so', 'than', 'too', 'very', 'i', 'me', 'my', 'myself', 'we', 
  'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 
  'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 
  'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 
  'those', 'am', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 
  'doing', 'would', 'should', 'could', 'ought', 'will', 'shall', 'can', 
  'may', 'might', 'must', 'as', 'if', 'because', 'until', 'while'
]);

/**
 * Tokenizes text into words, removing punctuation and converting to lowercase
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 0); // Remove empty tokens
}

/**
 * Removes stopwords from an array of tokens
 */
export function removeStopwords(tokens: string[]): string[] {
  return tokens.filter(token => !STOPWORDS.has(token));
}

/**
 * Creates n-grams from an array of tokens
 */
export function createNgrams(tokens: string[], n: number): string[] {
  if (n <= 0 || tokens.length < n) return [];
  
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  
  return ngrams;
}

/**
 * Preprocesses text by tokenizing, removing stopwords, and creating n-grams
 */
export function preprocessText(text: string, ngramSize: number = 3): string[] {
  const tokens = tokenize(text);
  const withoutStopwords = removeStopwords(tokens);
  return createNgrams(withoutStopwords, ngramSize);
}
