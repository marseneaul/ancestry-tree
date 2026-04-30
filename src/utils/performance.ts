export interface PerformanceMeasure {
  name: string;
  durationMs: number;
  startedAt: number;
}

const measures: PerformanceMeasure[] = [];

function canMeasure(): boolean {
  return typeof performance !== "undefined" && typeof performance.now === "function";
}

function shouldLog(): boolean {
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem("ancestry:perf") === "1";
  } catch {
    return false;
  }
}

export function measureSync<T>(name: string, work: () => T): T {
  if (!canMeasure()) return work();

  const startedAt = performance.now();
  try {
    return work();
  } finally {
    const durationMs = performance.now() - startedAt;
    measures.push({ name, durationMs, startedAt });

    if (shouldLog()) {
      console.debug(`[perf] ${name}: ${durationMs.toFixed(1)}ms`);
    }
  }
}

export async function measureAsync<T>(name: string, work: () => Promise<T>): Promise<T> {
  if (!canMeasure()) return work();

  const startedAt = performance.now();
  try {
    return await work();
  } finally {
    const durationMs = performance.now() - startedAt;
    measures.push({ name, durationMs, startedAt });

    if (shouldLog()) {
      console.debug(`[perf] ${name}: ${durationMs.toFixed(1)}ms`);
    }
  }
}

export function getPerformanceMeasures(): PerformanceMeasure[] {
  return [...measures];
}

export function clearPerformanceMeasures(): void {
  measures.length = 0;
}
