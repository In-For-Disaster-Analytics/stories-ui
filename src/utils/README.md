# Utility Functions

This directory contains utility functions for the Stories application.

## textSplitting.ts

Contains intelligent text splitting utilities for the transcription editor:

- `findBestSplitPoint()` - Finds the optimal position to split text, preferring sentence boundaries
- `findNearestWordBoundary()` - Finds the nearest word boundary to a given position
- `splitTextIntelligently()` - Splits text at the best available boundary
- `isSentenceBoundary()` - Checks if a position is at a sentence boundary
- `isWordBoundary()` - Checks if a position is at a word boundary

## Testing

The utility functions include comprehensive tests:

```bash
# Run utility tests (requires tsx to be installed)
npm run test:utils

# Or run directly with Node.js if tsx is available globally
tsx src/utils/runTests.ts
```

### Test Coverage

The tests cover:

- Basic functionality of all exported functions
- Edge cases (empty strings, single words, boundary conditions)
- Integration scenarios (complex text with multiple sentences)
- Performance testing for large text inputs
- Various text patterns (sentences, word boundaries, mixed content)

### Adding New Tests

Tests are located in `textSplitting.test.ts`. To add new tests:

1. Add your test function inside the `runTests()` function
2. Use the `test()` helper function to define your test
3. Use `assertEquals()` and `assertArrayEquals()` for assertions
4. Run the test suite to verify your changes

Example:
```typescript
test('My new test', () => {
  const result = myFunction('input');
  assertEquals(result, 'expected');
});
```