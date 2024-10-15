import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { modf } from "./index.ts";

Deno.test({
  name: "modf",
  fn() {
    const [units, nanos] = modf(100.2);
    const rawNanos = nanos * 1e9;
    const absNanosString = rawNanos?.toString()?.split(".")[0];
    const absNanos = absNanosString ? parseInt(absNanosString) : 0;

    assertEquals(units, 100);
    assertEquals(absNanos, 200000000);
  },
});
