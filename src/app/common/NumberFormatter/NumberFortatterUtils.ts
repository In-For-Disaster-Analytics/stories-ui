export const formatNumber = (
  num: number = 0,
  precision: number = 2,
  useScientificNotation: boolean = true,
  scientificNotationThreshold: { min: number; max: number } = {
    min: 0.01,
    max: 10000,
  },
): string => {
  // Handle special cases
  if (num === 0) return '0';
  if (isNaN(num)) return 'NaN';
  if (!isFinite(num)) return num > 0 ? '∞' : '-∞';

  const absNum = Math.abs(num);

  // Determine if scientific notation should be used
  const shouldUseScientificNotation =
    useScientificNotation &&
    (absNum < scientificNotationThreshold.min ||
      absNum > scientificNotationThreshold.max);

  if (shouldUseScientificNotation) {
    // Format with scientific notation
    return num.toExponential(precision);
  } else {
    // Format with fixed decimal places
    return num.toFixed(precision);
  }
};
