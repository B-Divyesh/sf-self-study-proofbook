import type { ProofbookState } from './types';

const now = '2026-08-20T19:00:00.000Z';

export const sampleState: ProofbookState = {
  topics: [
    { id: 'topic-analysis', name: 'Real analysis', goal: 'Write complete epsilon arguments without notes.' },
    { id: 'topic-algorithms', name: 'Graph algorithms', goal: 'Choose and justify the right invariant.' },
    { id: 'topic-algebra', name: 'Abstract algebra', goal: 'Connect definitions to short structural proofs.' },
  ],
  attempts: [
    {
      id: 'attempt-uniform', topicId: 'topic-analysis', title: 'Uniform limit of continuous functions',
      source: 'Understanding Analysis, 2nd ed.', sourceUrl: '', problemRef: 'Chapter 6, Exercise 6.2.7',
      startedAt: '2026-08-18T18:20:00.000Z', elapsedSeconds: 2480, timerStartedAt: null,
      status: 'mastered', confidence: 4,
      solution: 'Let $f_n \\to f$ uniformly. Fix $x$ and $\\varepsilon > 0$. Choose $N$ so that $|f_N(y)-f(y)| < \\varepsilon/3$ for every $y$. Continuity of $f_N$ supplies a neighborhood where the middle difference is also below $\\varepsilon/3$. The triangle inequality finishes the proof.',
      reflection: 'My first version chose N after the neighborhood. Reversing that order fixed the quantifiers.',
      revisions: [
        { id: 'rev-uniform-1', at: '2026-08-18T19:05:00.000Z', solution: 'Tried a triangle inequality with three terms, but chose N too late.', reflection: 'The dependency order was wrong.' },
        { id: 'rev-uniform-2', at: '2026-08-19T17:10:00.000Z', solution: 'Choose N from uniform convergence first. Then use continuity of the fixed function f_N.', reflection: 'Now each choice depends only on earlier fixed data.' },
      ], createdAt: '2026-08-18T18:20:00.000Z', updatedAt: '2026-08-19T17:10:00.000Z',
    },
    {
      id: 'attempt-dijkstra', topicId: 'topic-algorithms', title: 'Prove Dijkstra’s greedy step',
      source: 'Dijkstra’s algorithm reference', sourceUrl: 'https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm', problemRef: 'Section 4.4, proof reconstruction',
      startedAt: '2026-08-20T12:30:00.000Z', elapsedSeconds: 1920, timerStartedAt: null,
      status: 'revised', confidence: 3,
      solution: 'Assume the extracted vertex $v$ has the smallest tentative distance. On a shortest path to $v$, take the first edge leaving the settled set. Its endpoint had a tentative distance no larger than the path prefix, so $v$ cannot be extracted with an overestimate.',
      reflection: 'I can state the cut argument now. I still want to test the proof against zero-weight edges.',
      revisions: [{ id: 'rev-dijkstra-1', at: '2026-08-20T13:02:00.000Z', solution: 'Used a shortest-path contradiction, but did not identify the first unsettled vertex.', reflection: 'Name the boundary edge explicitly.' }],
      createdAt: '2026-08-20T12:30:00.000Z', updatedAt: '2026-08-20T13:02:00.000Z',
    },
    {
      id: 'attempt-lagrange', topicId: 'topic-algebra', title: 'Derive Lagrange’s theorem from cosets',
      source: 'Contemporary Abstract Algebra, 10th ed.', sourceUrl: '', problemRef: 'Section 7, self-check',
      startedAt: '2026-08-20T18:40:00.000Z', elapsedSeconds: 780, timerStartedAt: null,
      status: 'working', confidence: 2,
      solution: 'Left cosets of $H$ partition $G$. Each coset has $|H|$ elements because multiplication by its representative is a bijection.',
      reflection: 'Next: make the finite counting step explicit and state where finiteness is used.',
      revisions: [], createdAt: '2026-08-20T18:40:00.000Z', updatedAt: now,
    },
  ],
  selectedAttemptId: 'attempt-dijkstra',
  updatedAt: now,
};
