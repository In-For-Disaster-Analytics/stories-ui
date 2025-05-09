import React from 'react';
import { formatNumber } from './NumberFortatterUtils';

interface NumberFormatterProps {
  value: number;
  precision?: number;
  useScientificNotation?: boolean;
  scientificNotationThreshold?: {
    min: number;
    max: number;
  };
  className?: string;
}

const NumberFormatter: React.FC<NumberFormatterProps> = ({
  value,
  precision = 2,
  useScientificNotation = true,
  scientificNotationThreshold = {
    min: 0.01,
    max: 10000,
  },
  className = '',
}) => {
  return (
    <span className={className}>
      {formatNumber(
        value,
        precision,
        useScientificNotation,
        scientificNotationThreshold,
      )}
    </span>
  );
};

export default NumberFormatter;
