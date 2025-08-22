export enum DeferredState {
  Pending = "pending",
  Resolved = "resolved",
  Rejected = "rejected",
  Cancelled = "cancelled",
}

/**
 * A Deferred represents a promise that can be resolved or rejected externally.
 * This is useful for scenarios where you want to create a promise and resolve
 * or reject it at a later time based on some external event or condition.
 *
 * @example
 * const deferred = new Deferred<string>();
 * // Later in your code
 * deferred.resolve("Success!");
 * // Or in case of an error
 * deferred.reject(new Error("Something went wrong"));
 * // Await
 * const result = await deferred.promise;
 */
export class Deferred<T, E = Error> {
  public readonly promise: Promise<T>;
  public resolve!: (value: T | PromiseLike<T>) => void;
  public reject!: (reason: E) => void;

  private _state: DeferredState = DeferredState.Pending;
  private _value?: T;
  private _error?: E;
  private _settledAt?: Date;
  private _createdAt: Date = new Date();
  private timeoutHandle?: number;
  private onCancelCallbacks: Array<() => void> = [];

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = (value: T | PromiseLike<T>) => {
        if (this._state === DeferredState.Pending) {
          this._state = DeferredState.Resolved;
          this._value = value as T;
          this._settledAt = new Date();
          this.clearTimeout();
          resolve(value);
        }
      };

      this.reject = (reason: E) => {
        if (this._state === DeferredState.Pending) {
          this._state = DeferredState.Rejected;
          this._error = reason;
          this._settledAt = new Date();
          this.clearTimeout();
          reject(reason);
        }
      };
    });
  }

  // State getters

  /**
   * The current state of the deferred (pending, resolved, rejected, or cancelled)
   */
  get state(): DeferredState {
    return this._state;
  }
  /**
   * Whether the deferred is still pending (not resolved, rejected, or cancelled)
   */
  get isPending(): boolean {
    return this._state === DeferredState.Pending;
  }
  /**
   * Whether the deferred has been resolved
   */
  get isResolved(): boolean {
    return this._state === DeferredState.Resolved;
  }
  /**
   * Whether the deferred has been rejected
   */
  get isRejected(): boolean {
    return this._state === DeferredState.Rejected;
  }
  /**
   * Whether the deferred has been cancelled
   */
  get isCancelled(): boolean {
    return this._state === DeferredState.Cancelled;
  }
  /**
   * Whether the deferred has been settled (resolved, rejected, or cancelled)
   */
  get isSettled(): boolean {
    return !this.isPending;
  }

  // Value/error getters

  /**
   * The resolved value, if any (undefined if not resolved)
   */
  get value(): T | undefined {
    return this._value;
  }
  /**
   * The rejection error, if any (undefined if not rejected)
   */
  get error(): E | undefined {
    return this._error;
  }

  // Timing getters

  /**
   * The date the deferred was created
   */
  get createdAt(): Date {
    return this._createdAt;
  }
  /**
   * The date the deferred was settled (resolved, rejected, or cancelled), if any
   */
  get settledAt(): Date | undefined {
    return this._settledAt;
  }
  /**
   * The duration in milliseconds between creation and settlement, if settled
   */
  get duration(): number | undefined {
    if (!this._settledAt) return undefined;
    return this._settledAt.getTime() - this._createdAt.getTime();
  }

  // Timeout functionality

  /**
   * Set a timeout to automatically reject the promise if not settled within the specified time
   *
   * @param ms - milliseconds to wait before timing out
   * @param timeoutError
   * @returns
   */
  setTimeout(ms: number, timeoutError?: E): this {
    this.clearTimeout();
    this.timeoutHandle = setTimeout(() => {
      if (this.isPending) {
        const error =
          timeoutError || (new Error(`Deferred timed out after ${ms}ms`) as E);
        this.reject(error);
      }
    }, ms);
    return this;
  }

  private clearTimeout(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = undefined;
    }
  }

  // Cancellation

  /**
   * Cancel the promise if it is still pending.
   *
   * @param reason
   */
  cancel(reason?: string): void {
    if (this.isPending) {
      this._state = DeferredState.Cancelled;
      this._settledAt = new Date();
      this.clearTimeout();

      const error = new Error(reason || "Deferred was cancelled") as E;
      this._error = error;

      // Call all cancellation callbacks
      this.onCancelCallbacks.forEach((cb) => cb());
      this.onCancelCallbacks = [];

      // Reject the promise
      this.reject(error);
    }
  }

  /**
   * Register a callback to be called if the deferred is cancelled.
   * @param callback
   */
  onCancel(callback: () => void): void {
    if (this.isPending) {
      this.onCancelCallbacks.push(callback);
    } else if (this.isCancelled) {
      callback();
    }
  }

  // Reset - creates a new deferred with the same configuration

  /**
   * Create a new Deferred instance, effectively resetting the current one.
   *
   * @returns
   */
  reset(): Deferred<T, E> {
    return new Deferred<T, E>();
  }

  // Utility methods
  async wait(): Promise<T | undefined> {
    try {
      return await this.promise;
    } catch {
      return undefined;
    }
  }

  // Convert to a simple object for debugging/logging

  /**
   * Convert the deferred to a plain object for easy inspection/logging.
   *
   * @returns A plain object representation of the deferred's state and timing information
   */
  toJSON() {
    return {
      state: this._state,
      value: this._value,
      error: this._error?.toString(),
      createdAt: this._createdAt,
      settledAt: this._settledAt,
      duration: this.duration,
    };
  }
}

/**
 * A RetryableDeferred is a [Deferred] that adds retry capabilities for operations that may fail.
 */
export class RetryableDeferred<T, E = Error> extends Deferred<T, E> {
  private attempts = 0;
  private maxAttempts: number;
  private retryDelay: number;
  private operation: () => Promise<T>;

  constructor(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    retryDelay: number = 1000
  ) {
    super();
    this.operation = operation;
    this.maxAttempts = maxAttempts;
    this.retryDelay = retryDelay;
    this.executeWithRetry();
  }

  private async executeWithRetry(): Promise<void> {
    while (this.attempts < this.maxAttempts && this.isPending) {
      this.attempts++;

      try {
        const result = await this.operation();
        this.resolve(result);
        return;
      } catch (error) {
        if (this.attempts >= this.maxAttempts) {
          this.reject(error as E);
        } else {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        }
      }
    }
  }

  retry(): void {
    if (!this.isPending) {
      throw new Error("Cannot retry a settled deferred");
    }
    this.executeWithRetry();
  }

  /**
   * The number of attempts made so far
   */
  get attemptCount(): number {
    return this.attempts;
  }
  /**
   * The number of remaining attempts
   */
  get remainingAttempts(): number {
    return Math.max(0, this.maxAttempts - this.attempts);
  }
}

/**
 * A DeferredPool manages a collection of Deferred instances identified by unique keys.
 * It provides methods to create, retrieve, resolve, reject, and cancel deferreds in the pool.
 */
export class DeferredPool {
  private pool = new Map<string, Deferred<unknown, unknown>>();

  create<T, E = Error>(key: string): Deferred<T, E> {
    if (this.pool.has(key)) {
      throw new Error(`Deferred with key "${key}" already exists`);
    }

    const deferred = new Deferred<T, E>();
    this.pool.set(key, deferred as Deferred<unknown, unknown>);
    return deferred;
  }

  get<T, E = Error>(key: string): Deferred<T, E> | undefined {
    return this.pool.get(key) as Deferred<T, E> | undefined;
  }

  resolve<T>(key: string, value: T): boolean {
    const deferred = this.pool.get(key);
    if (deferred && deferred.isPending) {
      deferred.resolve(value);
      return true;
    }
    return false;
  }

  reject<E>(key: string, error: E): boolean {
    const deferred = this.pool.get(key);
    if (deferred && deferred.isPending) {
      deferred.reject(error);
      return true;
    }
    return false;
  }

  cancelAll(reason?: string): void {
    this.pool.forEach((deferred) => {
      if (deferred.isPending) {
        deferred.cancel(reason);
      }
    });
  }

  // Wait for all to settle
  async waitAll(): Promise<void> {
    const promises = Array.from(this.pool.values()).map((d) => d.wait());
    await Promise.all(promises);
  }

  // Get stats
  getStats() {
    let pending = 0,
      resolved = 0,
      rejected = 0,
      cancelled = 0;

    this.pool.forEach((deferred) => {
      if (deferred.isPending) pending++;
      else if (deferred.isResolved) resolved++;
      else if (deferred.isRejected) rejected++;
      else if (deferred.isCancelled) cancelled++;
    });

    return { total: this.pool.size, pending, resolved, rejected, cancelled };
  }
}
