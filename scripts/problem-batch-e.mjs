import { problemBatchEStrings } from './problem-batch-e-strings.mjs';
import { problemBatchENumbers } from './problem-batch-e-numbers.mjs';
import { problemBatchECompression } from './problem-batch-e-compression.mjs';
import { problemBatchEGeometry } from './problem-batch-e-geometry.mjs';

export const problemBatchE = {
  ...problemBatchEStrings,
  ...problemBatchENumbers,
  ...problemBatchECompression,
  ...problemBatchEGeometry,
};
