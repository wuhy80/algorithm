import { problemBatchFGraph } from './problem-batch-f-graph.mjs';
import { problemBatchFBacktrack } from './problem-batch-f-backtrack.mjs';
import { problemBatchFDP } from './problem-batch-f-dp.mjs';
import { problemBatchFStructures } from './problem-batch-f-structures.mjs';
import { problemBatchFSpatial } from './problem-batch-f-spatial.mjs';
import { problemBatchFML } from './problem-batch-f-ml.mjs';

export const problemBatchF = {
  ...problemBatchFGraph,
  ...problemBatchFBacktrack,
  ...problemBatchFDP,
  ...problemBatchFStructures,
  ...problemBatchFSpatial,
  ...problemBatchFML,
};
