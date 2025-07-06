import { describe, it, expect } from 'vitest';
import {
  findBestSplitPoint,
  findNearestWordBoundary,
  splitTextIntelligently,
  isSentenceBoundary,
  isWordBoundary,
} from './textSplitting';

describe('textSplitting utilities', () => {
  describe('findBestSplitPoint', () => {
    it('should handle empty string', () => {
      expect(findBestSplitPoint('')).toBe(0);
    });

    it('should handle single word', () => {
      const result = findBestSplitPoint('hello');
      expect(result).toBe(1); // Should fallback to 1/3 of length
    });

    it('should prefer sentence boundaries', () => {
      const text = 'First sentence. Second sentence here.';
      const result = findBestSplitPoint(text);
      expect(result).toBe(16); // Should split after "First sentence. "
    });

    it('should fallback to word boundaries when no sentence boundaries', () => {
      const text =
        'This is a long text without sentence endings that should split at word boundaries';
      const result = findBestSplitPoint(text);
      expect(text[result]).toBe(' '); // Should split at a space character
    });

    it('should handle custom position', () => {
      const text = 'First sentence. Second sentence. Third sentence.';
      const result = findBestSplitPoint(text, 0.7); // 70% through
      expect(result).toBe(33); // After "Second sentence. "
    });
  });

  describe('findNearestWordBoundary', () => {
    it('should find forward space when closer', () => {
      const text = 'hello world test';
      const result = findNearestWordBoundary(text, 3); // 'l' in 'hello'
      expect(result).toBe(5); // Space after 'hello'
    });

    it('should find backward space when closer', () => {
      const text = 'hello world test';
      const result = findNearestWordBoundary(text, 8); // 'r' in 'world'
      expect(result).toBe(11); // Space after 'world'
    });

    it('should go forward from beginning', () => {
      const text = 'hello world';
      const result = findNearestWordBoundary(text, 0);
      expect(result).toBe(5); // Should go forward to first space
    });

    it('should go backward from end', () => {
      const text = 'hello world';
      const result = findNearestWordBoundary(text, 10);
      expect(result).toBe(5); // Should go backward to last space
    });
  });

  describe('splitTextIntelligently', () => {
    it('should split at sentence boundaries', () => {
      const text = 'First sentence. Second sentence.';
      const [first, second] = splitTextIntelligently(text);
      expect(first).toBe('First sentence.');
      expect(second).toBe('Second sentence.');
    });

    it('should split at word boundaries when no sentence boundaries', () => {
      const text = 'This is a long text without sentence endings';
      const [first, second] = splitTextIntelligently(text);

      // Should split somewhere in the middle at a word boundary
      expect(first).not.toMatch(/\s$/); // First part should be trimmed
      expect(second).not.toMatch(/^\s/); // Second part should be trimmed
      expect(first + ' ' + second).toBe(text); // Recombined text should match original
    });

    it('should handle custom position', () => {
      const text = 'One. Two. Three. Four. Five.';
      const [first, second] = splitTextIntelligently(text, 0.3);
      expect(first).toBe('One. Two.');
      expect(second).toBe('Three. Four. Five.');
    });

    it('should handle empty string', () => {
      const [first, second] = splitTextIntelligently('');
      expect(first).toBe('');
      expect(second).toBe('');
    });

    it('should handle single word', () => {
      const [first, second] = splitTextIntelligently('hello');
      expect(first).toBe('h');
      expect(second).toBe('ello');
    });
  });

  describe('isSentenceBoundary', () => {
    it('should detect period with space', () => {
      const text = 'Hello. World';
      expect(isSentenceBoundary(text, 6)).toBe(true); // Position after '. '
    });

    it('should detect exclamation with space', () => {
      const text = 'Hello! World';
      expect(isSentenceBoundary(text, 6)).toBe(true); // Position after '! '
    });

    it('should detect question with space', () => {
      const text = 'Hello? World';
      expect(isSentenceBoundary(text, 6)).toBe(true); // Position after '? '
    });

    it('should return false for non-boundaries', () => {
      const text = 'Hello World';
      expect(isSentenceBoundary(text, 5)).toBe(false); // Position at space between words
    });

    it('should handle edge cases', () => {
      const text = 'Hello. World';
      expect(isSentenceBoundary(text, 0)).toBe(false); // Beginning
      expect(isSentenceBoundary(text, text.length)).toBe(false); // End
    });
  });

  describe('isWordBoundary', () => {
    it('should detect space character', () => {
      const text = 'Hello World';
      expect(isWordBoundary(text, 5)).toBe(true); // At space
    });

    it('should detect character after space', () => {
      const text = 'Hello World';
      expect(isWordBoundary(text, 6)).toBe(true); // After space
    });

    it('should return false for non-boundaries', () => {
      const text = 'Hello World';
      expect(isWordBoundary(text, 2)).toBe(false); // In middle of word
    });

    it('should handle edge cases', () => {
      const text = 'Hello World';
      expect(isWordBoundary(text, 0)).toBe(false); // Beginning
      expect(isWordBoundary(text, text.length)).toBe(false); // End
    });
  });

  describe('integration tests', () => {
    it('should handle complex text with multiple sentences', () => {
      const text =
        'The quick brown fox jumps over the lazy dog. This is a second sentence! And here is a third sentence? Finally, a fourth sentence with a comma.';
      const [first, second] = splitTextIntelligently(text);

      // Should split at a sentence boundary
      expect(first).toMatch(/[.!?]$/);
      expect(second.trim().length).toBeGreaterThan(0);

      // Verify the split is roughly in the middle
      const splitRatio = first.length / text.length;
      expect(splitRatio).toBeGreaterThan(0.2);
      expect(splitRatio).toBeLessThan(0.8);
    });

    it('should handle text with no sentence boundaries', () => {
      const text =
        'This is a very long text that contains no sentence endings at all just words and spaces everywhere';
      const [first, second] = splitTextIntelligently(text);

      // Should split at word boundary
      expect(first).toMatch(/\s/);
      expect(second).toMatch(/\s/);
      expect(first + ' ' + second).toBe(text);
    });

    it('should handle performance with large text', () => {
      const largeText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(
          1000,
        );
      const startTime = performance.now();
      const [first, second] = splitTextIntelligently(largeText);
      const endTime = performance.now();

      expect(first.length).toBeGreaterThan(0);
      expect(second.length).toBeGreaterThan(0);

      // Performance should be reasonable (less than 100ms for large text)
      const timeTaken = endTime - startTime;
      expect(timeTaken).toBeLessThan(100);
    });
  });
});
