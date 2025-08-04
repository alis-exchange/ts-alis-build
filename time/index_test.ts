import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { parse, formatDistance, encodeDate, encodeTimestamp } from "./index.ts";
import GoogleTypeDate from "npm:@alis-build/google-common-protos@latest/google/type/date_pb.js";
import Timestamp from "npm:@alis-build/google-common-protos@latest/google/protobuf/timestamp_pb.js";

Deno.test({
  name: "parseGoogleTypeDate",
  fn(t) {
    const date = new GoogleTypeDate.Date();
    date.setYear(2024);
    date.setMonth(10);
    date.setDay(1);

    const parsed = parse(date);

    assertEquals(
      parsed?.getFullYear(),
      2024,
      `Expected year to be 2024, but got ${parsed?.getFullYear()}`
    );
    assertEquals(
      parsed?.getMonth(),
      10 - 1,
      `Expected month to be 10, but got ${parsed?.getMonth()}`
    );
    assertEquals(
      parsed?.getDate(),
      1,
      `Expected date to be 1, but got ${parsed?.getDate()}`
    );
  },
});

Deno.test({
  name: "parseTimestamp",
  fn(t) {
    const time = new Date("2024-01-01T04:20:50.000Z");
    const timestamp = new Timestamp.Timestamp();
    timestamp.setSeconds(Math.floor(time.getTime() / 1000));
    timestamp.setNanos((time.getTime() % 1000) * 1000000);

    const parsed = parse(timestamp);

    assertEquals(
      parsed?.getUTCFullYear(),
      time.getUTCFullYear(),
      `Expected year to be ${time.getUTCFullYear()}, but got ${parsed?.getUTCFullYear()}`
    );
    assertEquals(
      parsed?.getUTCMonth(),
      time.getUTCMonth(),
      `Expected month to be ${time.getUTCMonth()}, but got ${parsed?.getUTCMonth()}`
    );
    assertEquals(
      parsed?.getUTCDate(),
      time.getUTCDate(),
      `Expected date to be ${time.getUTCDate()}, but got ${parsed?.getUTCDate()}`
    );
    assertEquals(
      parsed?.getUTCHours(),
      time.getUTCHours(),
      `Expected hours to be ${time.getUTCHours()}, but got ${parsed?.getUTCHours()}`
    );
    assertEquals(
      parsed?.getUTCMinutes(),
      time.getUTCMinutes(),
      `Expected minutes to be ${time.getUTCMinutes()}, but got ${parsed?.getUTCMinutes()}`
    );
    assertEquals(
      parsed?.getUTCSeconds(),
      time.getUTCSeconds(),
      `Expected seconds to be ${time.getUTCSeconds()}, but got ${parsed?.getUTCSeconds()}`
    );
    assertEquals(
      parsed?.getUTCMilliseconds(),
      time.getUTCMilliseconds(),
      `Expected milliseconds to be ${time.getUTCMilliseconds()}, but got ${parsed?.getUTCMilliseconds()}`
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
  name: "formatDistance",
  fn(t) {
    const endTime = new Date("2024-10-15T04:20:50.000Z");
    const timeStrings = {
      "2024-10-15T04:20:50.000Z": ["just now", "0 seconds"],
      "2024-10-15T04:20:49.000Z": ["just now", "1 second"],
      "2000-01-01T04:19:50.000Z": ["24 years ago", "24 years"],
      "2028-10-15T04:20:50.000Z": ["in 4 years", "4 years"],
    };

    for (const [timeStr, expectedValues] of Object.entries(timeStrings)) {
      const startTime = new Date(timeStr);
      const timestamp = new Timestamp.Timestamp();
      timestamp.setSeconds(Math.floor(startTime.getTime() / 1000));
      timestamp.setNanos((startTime.getTime() % 1000) * 1000000);

      const formatted = formatDistance(timestamp, endTime, false);
      assertEquals(
        formatted,
        expectedValues[1],
        `Expected ${expectedValues[1]}, but got ${formatted}`
      );

      const formattedRelative = formatDistance(timestamp, endTime, true);
      assertEquals(
        formattedRelative,
        expectedValues[0],
        `Expected ${expectedValues[0]}, but got ${formattedRelative}`
      );
    }
  },
});

Deno.test({
  name: "encodeDate",
  fn(t) {
    const date = new Date("2024-10-15T04:20:50.000Z");
    const googleDate = new GoogleTypeDate.Date();
    googleDate.setYear(date.getFullYear());
    googleDate.setMonth(date.getMonth() + 1);
    googleDate.setDay(date.getDate());

    const encoded = encodeDate(date);

    assertEquals(
      encoded?.getYear(),
      googleDate.getYear(),
      `Expected year to be ${googleDate.getYear()}, but got ${encoded?.getYear()}`
    );
    assertEquals(
      encoded?.getMonth(),
      googleDate.getMonth(),
      `Expected month to be ${googleDate.getMonth()}, but got ${encoded?.getMonth()}`
    );
    assertEquals(
      encoded?.getDay(),
      googleDate.getDay(),
      `Expected date to be ${googleDate.getDay()}, but got ${encoded?.getDay()}`
    );
  },
});

Deno.test({
  name: "encodeTimestamp",
  fn(t) {
    const date = new Date("2024-10-15T04:20:50.000Z");
    const timestamp = new Timestamp.Timestamp();
    timestamp.setSeconds(Math.floor(date.getTime() / 1000));
    timestamp.setNanos((date.getTime() % 1000) * 1000000);

    const encoded = encodeTimestamp(date);

    assertEquals(
      encoded?.getSeconds(),
      timestamp.getSeconds(),
      `Expected seconds to be ${timestamp.getSeconds()}, but got ${encoded?.getSeconds()}`
    );
    assertEquals(
      encoded?.getNanos(),
      timestamp.getNanos(),
      `Expected nanos to be ${timestamp.getNanos()}, but got ${encoded?.getNanos()}`
    );
  },
});
