export interface MockStats {
  impressions: number;
  reach: number;
  clicks: number;
  shares: number;
  engagementRate: number;
}

/**
 * Generates highly consistent mock statistical metrics suitable for dashboard presentation.
 *
 * @param {number} rate - The seed engagement rate percentage (e.g. 4.5).
 * @returns {MockStats} Structured statistical mock metrics.
 */
export function getRandomStats(rate: number): MockStats {
  const impressions = Math.floor(Math.random() * 8000) + 1500;
  const reach = Math.floor(impressions * 0.85);
  const clicks = Math.floor(impressions * (rate / 100) * 0.6);
  const shares = Math.floor(impressions * (rate / 100) * 0.15);
  return {
    impressions,
    reach,
    clicks,
    shares,
    engagementRate: parseFloat(rate.toFixed(1)),
  };
}
