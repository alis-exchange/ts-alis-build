import {
  assertEquals,
  assertExists,
  assertRejects,
  assertThrows,
  assert,
} from "@std/assert";
import {
  Deferred,
  DeferredState,
  RetryableDeferred,
  DeferredPool,
} from "./index.ts"; // Adjust the import path as needed

// Helper to create a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Deno.test("Deferred - Basic Resolution", async () => {
  const deferred = new Deferred<string>();

  assertEquals(deferred.state, DeferredState.Pending);
  assertEquals(deferred.isPending, true);
  assertEquals(deferred.isResolved, false);
  assertEquals(deferred.isRejected, false);
  assertEquals(deferred.isSettled, false);

  deferred.resolve("test value");

  assertEquals(deferred.state, DeferredState.Resolved);
  assertEquals(deferred.isPending, false);
  assertEquals(deferred.isResolved, true);
  assertEquals(deferred.isSettled, true);
  assertEquals(deferred.value, "test value");

  const result = await deferred.promise;
  assertEquals(result, "test value");
});

Deno.test("Deferred - Basic Rejection", async () => {
  const deferred = new Deferred<string>();
  const error = new Error("test error");

  deferred.reject(error);

  assertEquals(deferred.state, DeferredState.Rejected);
  assertEquals(deferred.isPending, false);
  assertEquals(deferred.isRejected, true);
  assertEquals(deferred.isSettled, true);
  assertEquals(deferred.error, error);

  await assertRejects(() => deferred.promise, Error, "test error");
});

Deno.test("Deferred - Custom Error Type", async () => {
  interface CustomError {
    code: number;
    message: string;
  }

  const deferred = new Deferred<string, CustomError>();
  const error: CustomError = { code: 404, message: "Not found" };

  deferred.reject(error);

  assertEquals(deferred.error, error);
  assertEquals(deferred.error?.code, 404);

  try {
    await deferred.promise;
    assert(false, "Should have thrown");
  } catch (e) {
    assertEquals((e as CustomError).code, 404);
    assertEquals((e as CustomError).message, "Not found");
  }
});

Deno.test("Deferred - Multiple Resolve Attempts", async () => {
  const deferred = new Deferred<number>();

  deferred.resolve(1);
  deferred.resolve(2); // Should be ignored
  deferred.reject(new Error("error")); // Should be ignored

  assertEquals(deferred.value, 1);
  assertEquals(await deferred.promise, 1);
});

Deno.test("Deferred - Multiple Reject Attempts", async () => {
  const deferred = new Deferred<number>();
  const error1 = new Error("error1");
  const error2 = new Error("error2");

  deferred.reject(error1);
  deferred.reject(error2); // Should be ignored
  deferred.resolve(1); // Should be ignored

  assertEquals(deferred.error, error1);
  await assertRejects(() => deferred.promise, Error, "error1");
});

Deno.test("Deferred - Timeout Success", async () => {
  const deferred = new Deferred<string>();
  deferred.setTimeout(100);

  await delay(50);
  assertEquals(deferred.isPending, true);

  await delay(60);
  assertEquals(deferred.isRejected, true);
  assertEquals(deferred.error?.message, "Deferred timed out after 100ms");
});

Deno.test("Deferred - Timeout with Custom Error", async () => {
  interface TimeoutError {
    type: string;
    timeout: number;
  }

  const deferred = new Deferred<string, TimeoutError>();
  const customError: TimeoutError = { type: "timeout", timeout: 50 };

  deferred.setTimeout(50, customError);

  await delay(60);
  assertEquals(deferred.error, customError);
});

Deno.test("Deferred - Timeout Cleared on Resolution", async () => {
  const deferred = new Deferred<string>();
  deferred.setTimeout(100);

  await delay(50);
  deferred.resolve("success");

  await delay(60); // Past the timeout
  assertEquals(deferred.isResolved, true);
  assertEquals(deferred.value, "success");
});

Deno.test("Deferred - Cancel", async () => {
  const deferred = new Deferred<string>();

  deferred.cancel("User cancelled");

  assertEquals(deferred.state, DeferredState.Cancelled);
  assertEquals(deferred.isCancelled, true);
  assertEquals(deferred.isSettled, true);
  assertEquals(deferred.error?.message, "User cancelled");

  await assertRejects(() => deferred.promise, Error, "User cancelled");
});

Deno.test("Deferred - Cancel with Default Message", async () => {
  const deferred = new Deferred<string>();

  deferred.cancel();

  assertEquals(deferred.error?.message, "Deferred was cancelled");
});

Deno.test("Deferred - Cancel Callbacks", async () => {
  const deferred = new Deferred<string>();
  let callbackCalled = false;

  deferred.onCancel(() => {
    callbackCalled = true;
  });

  assertEquals(callbackCalled, false);

  deferred.cancel();

  assertEquals(callbackCalled, true);
});

Deno.test("Deferred - Cancel Callback on Already Cancelled", () => {
  const deferred = new Deferred<string>();
  deferred.cancel();

  let callbackCalled = false;
  deferred.onCancel(() => {
    callbackCalled = true;
  });

  assertEquals(callbackCalled, true); // Should be called immediately
});

Deno.test("Deferred - Multiple Cancel Callbacks", () => {
  const deferred = new Deferred<string>();
  const calls: number[] = [];

  deferred.onCancel(() => calls.push(1));
  deferred.onCancel(() => calls.push(2));
  deferred.onCancel(() => calls.push(3));

  deferred.cancel();

  assertEquals(calls, [1, 2, 3]);
});

Deno.test("Deferred - Timing Properties", async () => {
  const deferred = new Deferred<string>();

  assertExists(deferred.createdAt);
  assertEquals(deferred.settledAt, undefined);
  assertEquals(deferred.duration, undefined);

  await delay(50);
  deferred.resolve("done");

  assertExists(deferred.settledAt);
  assertExists(deferred.duration);
  assert(deferred.duration! >= 50);
  assert(deferred.settledAt!.getTime() > deferred.createdAt.getTime());
});

Deno.test("Deferred - Wait Method Success", async () => {
  const deferred = new Deferred<string>();

  deferred.resolve("success");

  const result = await deferred.wait();
  assertEquals(result, "success");
});

Deno.test("Deferred - Wait Method Failure", async () => {
  const deferred = new Deferred<string>();

  deferred.reject(new Error("failure"));

  const result = await deferred.wait();
  assertEquals(result, undefined);
});

Deno.test("Deferred - Reset", () => {
  const deferred1 = new Deferred<string>();
  deferred1.resolve("test");

  const deferred2 = deferred1.reset();

  assertEquals(deferred2.isPending, true);
  assertEquals(deferred2.value, undefined);
  assert(deferred1 !== deferred2); // Different instances
});

Deno.test("Deferred - toJSON", async () => {
  const deferred = new Deferred<string>();

  let json = deferred.toJSON();
  assertEquals(json.state, DeferredState.Pending);
  assertEquals(json.value, undefined);
  assertEquals(json.error, undefined);
  assertExists(json.createdAt);
  assertEquals(json.settledAt, undefined);
  assertEquals(json.duration, undefined);

  await delay(10);
  deferred.resolve("test");

  json = deferred.toJSON();
  assertEquals(json.state, DeferredState.Resolved);
  assertEquals(json.value, "test");
  assertExists(json.settledAt);
  assertExists(json.duration);
  assert(json.duration >= 10);
});

// RetryableDeferred Tests

Deno.test("RetryableDeferred - Success on First Try", async () => {
  let attempts = 0;
  const operation = async () => {
    attempts++;
    return "success";
  };

  const deferred = new RetryableDeferred(operation);

  const result = await deferred.promise;
  assertEquals(result, "success");
  assertEquals(attempts, 1);
  assertEquals(deferred.attemptCount, 1);
  assertEquals(deferred.remainingAttempts, 2);
});

Deno.test("RetryableDeferred - Success After Retry", async () => {
  let attempts = 0;
  const operation = async () => {
    attempts++;
    if (attempts < 3) {
      throw new Error(`Attempt ${attempts} failed`);
    }
    return "success";
  };

  const deferred = new RetryableDeferred(operation, 3, 10);

  const result = await deferred.promise;
  assertEquals(result, "success");
  assertEquals(attempts, 3);
  assertEquals(deferred.attemptCount, 3);
  assertEquals(deferred.remainingAttempts, 0);
});

Deno.test("RetryableDeferred - Failure After Max Attempts", async () => {
  let attempts = 0;
  const operation = async () => {
    attempts++;
    throw new Error(`Attempt ${attempts} failed`);
  };

  const deferred = new RetryableDeferred(operation, 3, 10);

  await assertRejects(() => deferred.promise, Error, "Attempt 3 failed");

  assertEquals(attempts, 3);
  assertEquals(deferred.attemptCount, 3);
  assertEquals(deferred.remainingAttempts, 0);
});

Deno.test(
  "RetryableDeferred - Manual Retry Not Allowed After Settlement",
  async () => {
    const operation = async () => "success";
    const deferred = new RetryableDeferred(operation, 1);

    await deferred.promise;

    assertThrows(
      () => deferred.retry(),
      Error,
      "Cannot retry a settled deferred"
    );
  }
);

Deno.test("RetryableDeferred - Custom Retry Delay", async () => {
  let attempts = 0;
  const timestamps: number[] = [];

  const operation = async () => {
    timestamps.push(Date.now());
    attempts++;
    if (attempts < 3) {
      throw new Error("retry");
    }
    return "success";
  };

  const deferred = new RetryableDeferred(operation, 3, 100);

  await deferred.promise;

  assertEquals(attempts, 3);
  // Check that delays were approximately 100ms
  assert(timestamps[1] - timestamps[0] >= 90);
  assert(timestamps[2] - timestamps[1] >= 90);
});

// DeferredPool Tests

Deno.test("DeferredPool - Create and Get", () => {
  const pool = new DeferredPool();

  const deferred1 = pool.create<string>("key1");
  const deferred2 = pool.create<number>("key2");

  assertExists(deferred1);
  assertExists(deferred2);

  assertEquals(pool.get<string>("key1"), deferred1);
  assertEquals(pool.get<number>("key2"), deferred2);
  assertEquals(pool.get("nonexistent"), undefined);
});

Deno.test("DeferredPool - Duplicate Key Error", () => {
  const pool = new DeferredPool();

  pool.create("key1");

  assertThrows(
    () => pool.create("key1"),
    Error,
    'Deferred with key "key1" already exists'
  );
});

Deno.test("DeferredPool - Resolve via Pool", async () => {
  const pool = new DeferredPool();
  const deferred = pool.create<string>("key1");

  const success = pool.resolve("key1", "resolved value");
  assertEquals(success, true);

  const result = await deferred.promise;
  assertEquals(result, "resolved value");
});

Deno.test("DeferredPool - Reject via Pool", async () => {
  const pool = new DeferredPool();
  const deferred = pool.create<string>("key1");

  const success = pool.reject("key1", new Error("rejected"));
  assertEquals(success, true);

  await assertRejects(() => deferred.promise, Error, "rejected");
});

Deno.test("DeferredPool - Resolve Non-existent Key", () => {
  const pool = new DeferredPool();

  const success = pool.resolve("nonexistent", "value");
  assertEquals(success, false);
});

Deno.test("DeferredPool - Resolve Already Settled", async () => {
  const pool = new DeferredPool();
  const deferred = pool.create<string>("key1");

  deferred.resolve("first");

  const success = pool.resolve("key1", "second");
  assertEquals(success, false);

  assertEquals(await deferred.promise, "first");
});

Deno.test("DeferredPool - Cancel All", async () => {
  const pool = new DeferredPool();

  const deferred1 = pool.create<string>("key1");
  const deferred2 = pool.create<string>("key2");
  const deferred3 = pool.create<string>("key3");

  deferred1.resolve("resolved"); // Already settled

  pool.cancelAll("Batch cancel");

  assertEquals(deferred1.isResolved, true); // Not affected
  assertEquals(deferred2.isCancelled, true);
  assertEquals(deferred3.isCancelled, true);

  await assertRejects(() => deferred2.promise, Error, "Batch cancel");
  await assertRejects(() => deferred3.promise, Error, "Batch cancel");
});

Deno.test("DeferredPool - Wait All", async () => {
  const pool = new DeferredPool();

  const d1 = pool.create<string>("key1");
  const d2 = pool.create<number>("key2");
  const d3 = pool.create<boolean>("key3");

  setTimeout(() => d1.resolve("done"), 10);
  setTimeout(() => d2.reject(new Error("failed")), 20);
  setTimeout(() => d3.resolve(true), 30);

  await pool.waitAll();

  assertEquals(d1.isResolved, true);
  assertEquals(d2.isRejected, true);
  assertEquals(d3.isResolved, true);
});

Deno.test("DeferredPool - Get Stats", () => {
  const pool = new DeferredPool();

  const d1 = pool.create("key1");
  const d2 = pool.create("key2");
  const d3 = pool.create("key3");
  const d4 = pool.create("key4");
  const d5 = pool.create("key5");

  d1.resolve("done");
  d2.reject(new Error("failed"));
  d3.cancel();
  // d4 and d5 remain pending

  const stats = pool.getStats();

  assertEquals(stats.total, 5);
  assertEquals(stats.pending, 2);
  assertEquals(stats.resolved, 1);
  assertEquals(stats.rejected, 1);
  assertEquals(stats.cancelled, 1);
});

Deno.test("DeferredPool - Complex Type Handling", async () => {
  interface UserData {
    id: number;
    name: string;
  }

  interface ApiError {
    code: string;
    message: string;
  }

  const pool = new DeferredPool();

  const userDeferred = pool.create<UserData, ApiError>("user");

  pool.resolve("user", { id: 1, name: "Alice" });

  const result = await userDeferred.promise;
  assertEquals(result.id, 1);
  assertEquals(result.name, "Alice");
});

// Integration Tests

Deno.test("Integration - Deferred with Promise.race", async () => {
  const d1 = new Deferred<string>();
  const d2 = new Deferred<string>();

  setTimeout(() => d1.resolve("first"), 10);
  setTimeout(() => d2.resolve("second"), 20);

  const winner = await Promise.race([d1.promise, d2.promise]);
  assertEquals(winner, "first");
});

Deno.test("Integration - Deferred with Promise.all", async () => {
  const d1 = new Deferred<string>();
  const d2 = new Deferred<number>();
  const d3 = new Deferred<boolean>();

  setTimeout(() => d1.resolve("text"), 10);
  setTimeout(() => d2.resolve(42), 20);
  setTimeout(() => d3.resolve(true), 30);

  const results = await Promise.all([d1.promise, d2.promise, d3.promise]);
  assertEquals(results, ["text", 42, true]);
});

Deno.test("Integration - Deferred with async/await in try/catch", async () => {
  const deferred = new Deferred<string>();

  setTimeout(() => deferred.reject(new Error("async error")), 10);

  try {
    await deferred.promise;
    assert(false, "Should have thrown");
  } catch (error) {
    assertEquals((error as Error).message, "async error");
  }
});

Deno.test("Integration - Chaining Deferreds", async () => {
  const d1 = new Deferred<number>();
  const d2 = new Deferred<string>();

  d1.promise.then((num) => {
    d2.resolve(`Number was ${num}`);
  });

  d1.resolve(42);

  const result = await d2.promise;
  assertEquals(result, "Number was 42");
});

Deno.test("Edge Case - Resolve with Promise", async () => {
  const inner = new Deferred<string>();
  const outer = new Deferred<string>();

  outer.resolve(inner.promise);

  setTimeout(() => inner.resolve("nested value"), 10);

  const result = await outer.promise;
  assertEquals(result, "nested value");
});

Deno.test("Edge Case - Cancel During Timeout", async () => {
  const deferred = new Deferred<string>();

  deferred.setTimeout(100);

  await delay(50);
  deferred.cancel("Cancelled before timeout");

  assertEquals(deferred.isCancelled, true);
  assertEquals(deferred.error?.message, "Cancelled before timeout");

  await delay(60); // Past the original timeout
  // Should still be cancelled, not timed out
  assertEquals(deferred.error?.message, "Cancelled before timeout");
});
