/**
 * Utility functions for intelligent text splitting
 */

/**
 * Finds the best split point in a text, preferring sentence boundaries over word boundaries
 * @param text - The text to split
 * @param preferredPosition - The preferred position to split at (0-1, where 0.5 is the middle)
 * @returns The index where the text should be split
 */
export function findBestSplitPoint(text: string, preferredPosition: number = 0.5): number {
  if (text.length === 0) return 0;
  
  const targetIndex = Math.floor(text.length * preferredPosition);
  let splitIndex = targetIndex;
  
  // Look for sentence endings (., !, ?) near the target position
  const sentenceEndings = /[.!?]\s+/g;
  let match;
  let bestSentenceMatch = -1;
  let minDistance = Infinity;
  
  while ((match = sentenceEndings.exec(text)) !== null) {
    const distance = Math.abs(match.index + match[0].length - targetIndex);
    if (distance < minDistance) {
      minDistance = distance;
      bestSentenceMatch = match.index + match[0].length;
    }
  }
  
  // If we found a sentence boundary within reasonable distance (30% of text length), use it
  if (bestSentenceMatch !== -1 && minDistance < text.length * 0.3) {
    splitIndex = bestSentenceMatch;
  } else {
    // Otherwise, find the nearest word boundary
    splitIndex = findNearestWordBoundary(text, targetIndex);
  }
  
  // Ensure we don't split at the very beginning or end
  if (splitIndex <= 0) splitIndex = Math.floor(text.length / 3);
  if (splitIndex >= text.length) splitIndex = Math.floor(text.length * 2 / 3);
  
  return splitIndex;
}

/**
 * Finds the nearest word boundary (space character) to a target position
 * @param text - The text to search in
 * @param targetIndex - The target position
 * @returns The index of the nearest word boundary
 */
export function findNearestWordBoundary(text: string, targetIndex: number): number {
  // Look forward for a space
  let forwardIndex = targetIndex;
  while (forwardIndex < text.length && text[forwardIndex] !== ' ') {
    forwardIndex++;
  }
  
  // Look backward for a space
  let backwardIndex = targetIndex;
  while (backwardIndex > 0 && text[backwardIndex] !== ' ') {
    backwardIndex--;
  }
  
  // Choose the closest word boundary
  if (forwardIndex >= text.length) {
    return backwardIndex;
  } else if (backwardIndex <= 0) {
    return forwardIndex;
  } else {
    const forwardDistance = forwardIndex - targetIndex;
    const backwardDistance = targetIndex - backwardIndex;
    return forwardDistance <= backwardDistance ? forwardIndex : backwardIndex;
  }
}

/**
 * Splits text at the best available boundary, trimming whitespace from both parts
 * @param text - The text to split
 * @param preferredPosition - The preferred position to split at (0-1, where 0.5 is the middle)
 * @returns An array containing the two parts of the split text
 */
export function splitTextIntelligently(text: string, preferredPosition: number = 0.5): [string, string] {
  const splitIndex = findBestSplitPoint(text, preferredPosition);
  
  const firstPart = text.substring(0, splitIndex).trim();
  const secondPart = text.substring(splitIndex).trim();
  
  return [firstPart, secondPart];
}

/**
 * Checks if a position is at a sentence boundary
 * @param text - The text to check
 * @param position - The position to check
 * @returns True if the position is at a sentence boundary
 */
export function isSentenceBoundary(text: string, position: number): boolean {
  if (position <= 0 || position >= text.length) return false;
  
  // Check if there's a sentence ending before this position
  const beforeChar = text[position - 1];
  const atChar = text[position];
  
  return /[.!?]/.test(beforeChar) && /\s/.test(atChar);
}

/**
 * Checks if a position is at a word boundary
 * @param text - The text to check
 * @param position - The position to check
 * @returns True if the position is at a word boundary
 */
export function isWordBoundary(text: string, position: number): boolean {
  if (position <= 0 || position >= text.length) return false;
  
  return text[position] === ' ' || text[position - 1] === ' ';
}