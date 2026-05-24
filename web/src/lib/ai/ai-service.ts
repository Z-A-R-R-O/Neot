export interface AIProvider {
  generate(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<string>;
}

interface AICacheEntry {
  result: string;
  createdAt: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000;

export class AIService {
  private provider: AIProvider | null = null;
  private cache = new Map<string, AICacheEntry>();
  private usageLog: { feature: string; tokens: number; cost: number; timestamp: number }[] = [];
  private rateLimits = new Map<string, number[]>();

  private featureCosts: Record<string, { tokensPerCall: number; costPerCall: number }> = {
    story: { tokensPerCall: 500, costPerCall: 0.002 },
    simplify: { tokensPerCall: 200, costPerCall: 0.001 },
  };

  constructor(provider?: AIProvider) {
    this.provider = provider ?? null;
  }

  setProvider(provider: AIProvider) {
    this.provider = provider;
  }

  private getCacheKey(feature: string, params: string): string {
    return `${feature}:${params}`;
  }

  private getFromCache(feature: string, params: string): string | null {
    const key = this.getCacheKey(feature, params);
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.createdAt > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    return entry.result;
  }

  private addToCache(feature: string, params: string, result: string) {
    const key = this.getCacheKey(feature, params);
    this.cache.set(key, { result, createdAt: Date.now() });
  }

  private checkRateLimit(userId: string, feature: string): boolean {
    const key = `${userId}:${feature}`;
    const timestamps = this.rateLimits.get(key) ?? [];
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < 60_000);
    if (recent.length >= 10) return false;
    recent.push(now);
    this.rateLimits.set(key, recent);
    return true;
  }

  private logUsage(feature: string, success: boolean) {
    const cost = this.featureCosts[feature] ?? { tokensPerCall: 100, costPerCall: 0.0005 };
    this.usageLog.push({
      feature,
      tokens: cost.tokensPerCall,
      cost: success ? cost.costPerCall : 0,
      timestamp: Date.now(),
    });
  }

  async generate(feature: string, prompt: string, userId: string, cacheKey?: string): Promise<string> {
    if (!this.provider) {
      throw new Error("AI provider not configured. Set OPENAI_API_KEY or similar in environment.");
    }

    if (!this.checkRateLimit(userId, feature)) {
      throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
    }

    if (cacheKey) {
      const cached = this.getFromCache(feature, cacheKey);
      if (cached) return cached;
    }

    try {
      const result = await this.provider.generate(prompt);
      if (cacheKey) this.addToCache(feature, cacheKey, result);
      this.logUsage(feature, true);
      return result;
    } catch (error) {
      this.logUsage(feature, false);
      throw error;
    }
  }

  getUsageReport() {
    const featureTotals: Record<string, { calls: number; totalTokens: number; totalCost: number }> = {};

    for (const log of this.usageLog) {
      if (!featureTotals[log.feature]) {
        featureTotals[log.feature] = { calls: 0, totalTokens: 0, totalCost: 0 };
      }
      featureTotals[log.feature].calls++;
      featureTotals[log.feature].totalTokens += log.tokens;
      featureTotals[log.feature].totalCost += log.cost;
    }

    const totalCost = Object.values(featureTotals).reduce((s, f) => s + f.totalCost, 0);

    return { features: featureTotals, totalCost, totalCalls: this.usageLog.length };
  }

  clearCache() {
    this.cache.clear();
  }
}

export const aiService = new AIService();
