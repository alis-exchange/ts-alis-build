import {
  assertEquals,
  assertExists,
} from "https://deno.land/std/testing/asserts.ts";
import { Duration, parse, encode } from "./index.ts";
import type { TimeUnits } from "./index.ts";

Deno.test({
  name: "parse",
  fn(t) {
    const timeUnits: TimeUnits = {
      hours: 1,
      minutes: 60,
      seconds: 3600,
      milliseconds: 3600000,
      microseconds: 3600000000,
      nanoseconds: 3600000000000,
    };
    const totalHours =
      (timeUnits.hours ?? 0) +
      (timeUnits.minutes ?? 0) / 60 +
      (timeUnits.seconds ?? 0) / 3600 +
      (timeUnits.milliseconds ?? 0) / 3600000 +
      (timeUnits.microseconds ?? 0) / 3600000000 +
      (timeUnits.nanoseconds ?? 0) / 3600000000000;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalHours * 3600;
    const totalMilliseconds = totalHours * 3600 * 1000;
    const totalMicroseconds = totalHours * 3600 * 1000 * 1000;
    const totalNanoseconds = totalHours * 3600 * 1000 * 1000 * 1000;

    const duration = new Duration(timeUnits);

    const parsed = parse(duration.toDuration());

    assertExists(parsed, "Expected parsed to be defined");

    assertEquals(
      parsed?.getTotalHours(),
      totalHours,
      `Expected hours to be ${totalHours}, but got ${parsed?.getTotalHours()}`
    );

    assertEquals(
      parsed?.getTotalMinutes(),
      totalMinutes,
      `Expected minutes to be ${totalMinutes}, but got ${parsed?.getTotalMinutes()}`
    );

    assertEquals(
      parsed?.getTotalSeconds(),
      totalSeconds,
      `Expected seconds to be ${totalSeconds}, but got ${parsed?.getTotalSeconds()}`
    );

    assertEquals(
      parsed?.getTotalMilliseconds(),
      totalMilliseconds,
      `Expected milliseconds to be ${totalMilliseconds}, but got ${parsed?.getTotalMilliseconds()}`
    );

    assertEquals(
      parsed?.getTotalMicroseconds(),
      totalMicroseconds,
      `Expected microseconds to be ${totalMicroseconds}, but got ${parsed?.getTotalMicroseconds()}`
    );

    assertEquals(
      parsed?.getTotalNanoseconds(),
      totalNanoseconds,
      `Expected nanoseconds to be ${totalNanoseconds}, but got ${parsed?.getTotalNanoseconds()}`
    );
  },
});

Deno.test({
  name: "parseNullish",
  fn(t) {
    assertEquals(parse(), null);
    assertEquals(parse(undefined), null);
  },
});

Deno.test({
  name: "encode",
  fn(t) {
    const timeUnits: TimeUnits = {
      hours: 1,
      minutes: 60,
      seconds: 3600,
      milliseconds: 3600000,
      microseconds: 3600000000,
      nanoseconds: 3600000000000,
    };
    const totalHours =
      (timeUnits.hours ?? 0) +
      (timeUnits.minutes ?? 0) / 60 +
      (timeUnits.seconds ?? 0) / 3600 +
      (timeUnits.milliseconds ?? 0) / 3600000 +
      (timeUnits.microseconds ?? 0) / 3600000000 +
      (timeUnits.nanoseconds ?? 0) / 3600000000000;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalHours * 3600;
    const totalMilliseconds = totalHours * 3600 * 1000;
    const totalMicroseconds = totalHours * 3600 * 1000 * 1000;
    const totalNanoseconds = totalHours * 3600 * 1000 * 1000 * 1000;

    const duration = new Duration(timeUnits);
    const encoded = encode(duration);

    assertExists(encoded, "Expected encoded to be defined");

    assertEquals(
      encoded?.getSeconds(),
      totalSeconds,
      `Expected seconds to be ${totalSeconds}, but got ${encoded?.getSeconds()}`
    );

    assertEquals(
      encoded?.getNanos(),
      (totalSeconds % 1) * 1e9,
      `Expected nanos to be ${
        (totalSeconds % 1) * 1e9
      }, but got ${encoded?.getNanos()}`
    );
  },
});
