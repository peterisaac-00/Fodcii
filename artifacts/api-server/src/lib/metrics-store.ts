const MAX_RESPONSE_TIMES = 1000;

export interface EndpointStat {
  requests: number;
  failures: number;
  totalLatency: number;
}

class MetricsStore {
  private startedAt = Date.now();
  private totalRequests = 0;
  private failedRequests = 0;
  private responseTimes: number[] = [];
  private submissionsCount = 0;
  private endpointStats = new Map<string, EndpointStat>();

  recordRequest(opts: {
    method: string;
    path: string;
    statusCode: number;
    latencyMs: number;
  }) {
    this.totalRequests++;

    if (opts.statusCode >= 400) this.failedRequests++;

    this.responseTimes.push(opts.latencyMs);
    if (this.responseTimes.length > MAX_RESPONSE_TIMES) {
      this.responseTimes.shift();
    }

    const key = `${opts.method} ${opts.path}`;
    const existing = this.endpointStats.get(key) ?? {
      requests: 0,
      failures: 0,
      totalLatency: 0,
    };
    existing.requests++;
    if (opts.statusCode >= 400) existing.failures++;
    existing.totalLatency += opts.latencyMs;
    this.endpointStats.set(key, existing);
  }

  recordSubmission() {
    this.submissionsCount++;
  }

  getSnapshot() {
    const avg =
      this.responseTimes.length > 0
        ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
        : 0;

    const endpoints: Record<string, { requests: number; failures: number; avgLatencyMs: number }> = {};
    for (const [key, stat] of this.endpointStats.entries()) {
      endpoints[key] = {
        requests: stat.requests,
        failures: stat.failures,
        avgLatencyMs: stat.requests > 0 ? Math.round(stat.totalLatency / stat.requests) : 0,
      };
    }

    return {
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      totalRequests: this.totalRequests,
      failedRequests: this.failedRequests,
      successRate:
        this.totalRequests > 0
          ? `${(((this.totalRequests - this.failedRequests) / this.totalRequests) * 100).toFixed(2)}%`
          : "100.00%",
      averageResponseTimeMs: Math.round(avg),
      submissionsCount: this.submissionsCount,
      endpoints,
    };
  }
}

export const metricsStore = new MetricsStore();
