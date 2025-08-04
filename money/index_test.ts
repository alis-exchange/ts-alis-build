import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import Money from "npm:@alis-build/google-common-protos@latest/google/type/money_pb.js";
import { parse, encode, format } from "./index.ts";

Deno.test({
  name: "parseMoney",
  fn() {
    const money = new Money.Money();
    money.setCurrencyCode("USD");
    money.setUnits(100);
    money.setNanos(0);

    const parsed = parse(money);

    assertEquals(
      parsed,
      100,
      `Expected parsed value to be 100, but got ${parsed}`
    );
  },
});

Deno.test({
  name: "parseMoneyWithNanos",
  fn() {
    const money = new Money.Money();
    money.setCurrencyCode("USD");
    money.setUnits(100);
    money.setNanos(200000000);

    const parsed = parse(money);

    assertEquals(
      parsed,
      100.2,
      `Expected parsed value to be 100.20, but got ${parsed}`
    );
  },
});

Deno.test({
  name: "encodeMoney",
  fn() {
    const money = encode("USD", 100);

    assertEquals(
      money?.getCurrencyCode(),
      "USD",
      `Expected currency code to be USD, but got ${money?.getCurrencyCode()}`
    );
    assertEquals(
      money?.getUnits(),
      100,
      `Expected units to be 100, but got ${money?.getUnits()}`
    );
    assertEquals(
      money?.getNanos(),
      0,
      `Expected nanos to be 0, but got ${money?.getNanos()}`
    );
  },
});

Deno.test({
  name: "encodeMoneyWithNanos",
  fn() {
    const money = encode("USD", 100.2);

    assertEquals(
      money?.getCurrencyCode(),
      "USD",
      `Expected currency code to be USD, but got ${money?.getCurrencyCode()}`
    );
    assertEquals(
      money?.getUnits(),
      100,
      `Expected units to be 100, but got ${money?.getUnits()}`
    );
    assertEquals(
      money?.getNanos(),
      200000000,
      `Expected nanos to be 200000000, but got ${money?.getNanos()}`
    );
  },
});

Deno.test({
  name: "formatMoney",
  fn() {
    const money = new Money.Money();
    money.setCurrencyCode("USD");
    money.setUnits(100);
    money.setNanos(0);

    const formatted = format(money);

    assertEquals(
      formatted,
      "$100.00",
      `Expected formatted value to be $100.00, but got ${formatted}`
    );
  },
});

Deno.test({
  name: "formatMoneyWithNanos",
  fn() {
    const money = new Money.Money();
    money.setCurrencyCode("USD");
    money.setUnits(100);
    money.setNanos(200000000);

    const formatted = format(money);

    assertEquals(
      formatted,
      "$100.20",
      `Expected formatted value to be $100.20, but got ${formatted}`
    );
  },
});
