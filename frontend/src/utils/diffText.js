/**
 * Simple word-level diff utility.
 * Returns array of {text, type: 'same'|'removed'|'added'} segments.
 */
export function diffText(original, corrected) {
  if (!original || !corrected) return [];

  const origWords = original.split(/(\s+)/);
  const corrWords = corrected.split(/(\s+)/);

  // LCS-based diff
  const m = origWords.length;
  const n = corrWords.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = origWords[i - 1] === corrWords[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const result = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origWords[i - 1] === corrWords[j - 1]) {
      result.unshift({ text: origWords[i - 1], type: 'same' });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ text: corrWords[j - 1], type: 'added' });
      j--;
    } else {
      result.unshift({ text: origWords[i - 1], type: 'removed' });
      i--;
    }
  }

  return result;
}

