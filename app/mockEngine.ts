export function analyzeOrganization(intent: string, signals: string) {
  const intentKeywords = intent.toLowerCase().split(/,|\n| /).filter(Boolean);
  const signalText = signals.toLowerCase();

  let mismatchScore = 0;

  // simple heuristic contradiction detection
  intentKeywords.forEach((word) => {
    if (!signalText.includes(word)) {
      mismatchScore += 10;
    }
  });

  const divergence = Math.min(100, 40 + mismatchScore);
  const contradiction = Math.min(100, 30 + mismatchScore * 1.2);
  const drift = Math.min(100, 20 + mismatchScore * 1.5);

  const insight =
    divergence > 70
      ? `Strong misalignment detected between declared priorities and operational behavior.`
      : `Moderate alignment with some strategic gaps.`;

  // extract evidence snippets
  const snippets = signals
    .split("\n")
    .filter((s) => s.trim().length > 10)
    .slice(0, 3);

  return {
    divergence: Math.round(divergence),
    contradiction: Math.round(contradiction),
    drift: Math.round(drift),
    insight,
    snippets,
  };
}