export class TTLCache<T> {
  private data: T | null = null;
  private expiresAt = 0;

  constructor(private readonly ttlMs: number) {}

  get(): T | null {
    if (this.data === null || Date.now() > this.expiresAt) {
      this.data = null;
      return null;
    }
    return this.data;
  }

  set(value: T): void {
    this.data = value;
    this.expiresAt = Date.now() + this.ttlMs;
  }

  invalidate(): void {
    this.data = null;
    this.expiresAt = 0;
  }
}
