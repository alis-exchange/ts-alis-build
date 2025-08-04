import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  getAllEnumKeys,
  getAllEnumValues,
  getAllEnumEntries,
  getEnumKeyByValue,
  getEnumValueByKey,
} from "./index.ts";

enum State {
  STATE_UNSPECIFIED = 0,
  RUNNING = 1,
  DEPLOYING = 2,
  DEPLOY_FAILED = 3,
  PLANNING = 4,
  PLANNED = 5,
  PLAN_FAILED = 6,
  PLANNING_DESTROY = 7,
  PLAN_DESTROY_FAILED = 8,
  PLANNED_DESTROY = 9,
  DESTROYING = 10,
  DESTROY_FAILED = 11,
  DESTROYED = 12,
}

Deno.test({
  name: "getAllEnumKeys",
  fn() {
    const keys = getAllEnumKeys(State);
    assertEquals(keys, [
      "STATE_UNSPECIFIED",
      "RUNNING",
      "DEPLOYING",
      "DEPLOY_FAILED",
      "PLANNING",
      "PLANNED",
      "PLAN_FAILED",
      "PLANNING_DESTROY",
      "PLAN_DESTROY_FAILED",
      "PLANNED_DESTROY",
      "DESTROYING",
      "DESTROY_FAILED",
      "DESTROYED",
    ]);
  },
});

Deno.test({
  name: "getAllEnumValues",
  fn() {
    const values = getAllEnumValues(State);
    assertEquals(values, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  },
});

Deno.test({
  name: "getAllEnumEntries",
  fn() {
    const entries = getAllEnumEntries(State);
    assertEquals(entries, [
      ["STATE_UNSPECIFIED", 0],
      ["RUNNING", 1],
      ["DEPLOYING", 2],
      ["DEPLOY_FAILED", 3],
      ["PLANNING", 4],
      ["PLANNED", 5],
      ["PLAN_FAILED", 6],
      ["PLANNING_DESTROY", 7],
      ["PLAN_DESTROY_FAILED", 8],
      ["PLANNED_DESTROY", 9],
      ["DESTROYING", 10],
      ["DESTROY_FAILED", 11],
      ["DESTROYED", 12],
    ]);
  },
});

Deno.test({
  name: "getEnumKeyByValue",
  fn() {
    const key = getEnumKeyByValue(State, 1);
    assertEquals(key, "RUNNING");
  },
});

Deno.test({
  name: "getEnumValueByKey",
  fn() {
    const value = getEnumValueByKey(State, "RUNNING");
    assertEquals(value, 1);
  },
});
