import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {
  snakeCaseToCamelCase,
  camelCaseToSnakeCase,
  snakeCaseToKebabCase,
  kebabCaseToSnakeCase,
  camelCaseToKebabCase,
  kebabCaseToCamelCase,
  snakeCaseToPascalCase,
  pascalCaseToSnakeCase,
  kebabCaseToPascalCase,
  pascalCaseToKebabCase,
  camelCaseToPascalCase,
  pascalCaseToCamelCase,
  toTitleCase,
  toConstantCase,
} from "./index.ts";

Deno.test({
  name: "snakeCaseToCamelCase",
  fn() {
    assertEquals(snakeCaseToCamelCase("snake_case"), "snakeCase");
    assertEquals(snakeCaseToCamelCase("snake_Case_test"), "snakeCaseTest");
    assertEquals(
      snakeCaseToCamelCase("snake_case_test_test"),
      "snakeCaseTestTest"
    );
    assertEquals(
      snakeCaseToCamelCase("_snake_case_test_test"),
      "snakeCaseTestTest"
    );
    assertEquals(
      snakeCaseToCamelCase("snake_case_test_test_"),
      "snakeCaseTestTest"
    );
    assertEquals(
      snakeCaseToCamelCase("_snake_case_test_test_"),
      "snakeCaseTestTest"
    );
    assertEquals(
      snakeCaseToCamelCase("snakeCaseTestTest"),
      "snakeCaseTestTest"
    );
  },
});

Deno.test({
  name: "camelCaseToSnakeCase",
  fn() {
    assertEquals(camelCaseToSnakeCase("camelCase"), "camel_case");
    assertEquals(camelCaseToSnakeCase("camelCaseTest"), "camel_case_test");
    assertEquals(
      camelCaseToSnakeCase("camelCaseTestTest"),
      "camel_case_test_test"
    );
    assertEquals(
      camelCaseToSnakeCase("_camelCaseTestTest"),
      "_camel_case_test_test"
    );
    assertEquals(
      camelCaseToSnakeCase("camelCaseTestTest_"),
      "camel_case_test_test_"
    );
    assertEquals(
      camelCaseToSnakeCase("_camelCaseTestTest_"),
      "_camel_case_test_test_"
    );
    assertEquals(
      camelCaseToSnakeCase("camel_case_test_test"),
      "camel_case_test_test"
    );
  },
});

Deno.test({
  name: "snakeCaseToKebabCase",
  fn() {
    assertEquals(snakeCaseToKebabCase("snake_case"), "snake-case");
    assertEquals(snakeCaseToKebabCase("snake_Case_test"), "snake-Case-test");
    assertEquals(
      snakeCaseToKebabCase("snake_case_test_test"),
      "snake-case-test-test"
    );
    assertEquals(
      snakeCaseToKebabCase("_snake_case_test_test"),
      "-snake-case-test-test"
    );
    assertEquals(
      snakeCaseToKebabCase("snake_case_test_test_"),
      "snake-case-test-test-"
    );
    assertEquals(
      snakeCaseToKebabCase("_snake_case_test_test_"),
      "-snake-case-test-test-"
    );
    assertEquals(
      snakeCaseToKebabCase("snakeCaseTestTest"),
      "snakeCaseTestTest"
    );
  },
});

Deno.test({
  name: "kebabCaseToSnakeCase",
  fn() {
    assertEquals(kebabCaseToSnakeCase("kebab-case"), "kebab_case");
    assertEquals(kebabCaseToSnakeCase("kebab-Case-test"), "kebab_Case_test");
    assertEquals(
      kebabCaseToSnakeCase("kebab-case-test-test"),
      "kebab_case_test_test"
    );
    assertEquals(
      kebabCaseToSnakeCase("-kebab-case-test-test"),
      "_kebab_case_test_test"
    );
    assertEquals(
      kebabCaseToSnakeCase("kebab-case-test-test-"),
      "kebab_case_test_test_"
    );
    assertEquals(
      kebabCaseToSnakeCase("-kebab-case-test-test-"),
      "_kebab_case_test_test_"
    );
    assertEquals(
      kebabCaseToSnakeCase("kebabCaseTestTest"),
      "kebabCaseTestTest"
    );
  },
});

Deno.test({
  name: "camelCaseToKebabCase",
  fn() {
    assertEquals(camelCaseToKebabCase("camelCase"), "camel-case");
    assertEquals(camelCaseToKebabCase("camelCaseTest"), "camel-case-test");
    assertEquals(
      camelCaseToKebabCase("camelCaseTestTest"),
      "camel-case-test-test"
    );
    assertEquals(
      camelCaseToKebabCase("_camelCaseTestTest"),
      "-camel-case-test-test"
    );
    assertEquals(
      camelCaseToKebabCase("camelCaseTestTest_"),
      "camel-case-test-test-"
    );
    assertEquals(
      camelCaseToKebabCase("_camelCaseTestTest_"),
      "-camel-case-test-test-"
    );
    assertEquals(
      camelCaseToKebabCase("camel_case_test_test"),
      "camel-case-test-test"
    );
  },
});

Deno.test({
  name: "kebabCaseToCamelCase",
  fn() {
    assertEquals(kebabCaseToCamelCase("kebab-case"), "kebabCase");
    assertEquals(kebabCaseToCamelCase("kebab-Case-test"), "kebabCaseTest");
    assertEquals(
      kebabCaseToCamelCase("kebab-case-test-test"),
      "kebabCaseTestTest"
    );
    assertEquals(
      kebabCaseToCamelCase("-kebab-case-test-test"),
      "kebabCaseTestTest"
    );
    assertEquals(
      kebabCaseToCamelCase("kebab-case-test-test-"),
      "kebabCaseTestTest"
    );
    assertEquals(
      kebabCaseToCamelCase("-kebab-case-test-test-"),
      "kebabCaseTestTest"
    );
    assertEquals(
      kebabCaseToCamelCase("kebabCaseTestTest"),
      "kebabCaseTestTest"
    );
  },
});

Deno.test({
  name: "snakeCaseToPascalCase",
  fn() {
    assertEquals(snakeCaseToPascalCase("snake_case"), "SnakeCase");
    assertEquals(snakeCaseToPascalCase("snake_Case_test"), "SnakeCaseTest");
    assertEquals(
      snakeCaseToPascalCase("snake_case_test_test"),
      "SnakeCaseTestTest"
    );
    assertEquals(
      snakeCaseToPascalCase("_snake_case_test_test"),
      "SnakeCaseTestTest"
    );
    assertEquals(
      snakeCaseToPascalCase("snake_case_test_test_"),
      "SnakeCaseTestTest"
    );
    assertEquals(
      snakeCaseToPascalCase("_snake_case_test_test_"),
      "SnakeCaseTestTest"
    );
    assertEquals(
      snakeCaseToPascalCase("snakeCaseTestTest"),
      "SnakeCaseTestTest"
    );
  },
});

Deno.test({
  name: "pascalCaseToSnakeCase",
  fn() {
    assertEquals(pascalCaseToSnakeCase("PascalCase"), "pascal_case");
    assertEquals(pascalCaseToSnakeCase("PascalCaseTest"), "pascal_case_test");
    assertEquals(
      pascalCaseToSnakeCase("PascalCaseTestTest"),
      "pascal_case_test_test"
    );
    assertEquals(
      pascalCaseToSnakeCase("PascalCaseTestTest"),
      "pascal_case_test_test"
    );
    assertEquals(
      pascalCaseToSnakeCase("PascalCaseTestTest"),
      "pascal_case_test_test"
    );
    assertEquals(
      pascalCaseToSnakeCase("PascalCaseTestTest"),
      "pascal_case_test_test"
    );
    assertEquals(
      pascalCaseToSnakeCase("pascal_case_test_test"),
      "pascal_case_test_test"
    );
  },
});

Deno.test({
  name: "kebabCaseToPascalCase",
  fn() {
    assertEquals(kebabCaseToPascalCase("kebab-case"), "KebabCase");
    assertEquals(kebabCaseToPascalCase("kebab-Case-test"), "KebabCaseTest");
    assertEquals(
      kebabCaseToPascalCase("kebab-case-test-test"),
      "KebabCaseTestTest"
    );
    assertEquals(
      kebabCaseToPascalCase("-kebab-case-test-test"),
      "KebabCaseTestTest"
    );
    assertEquals(
      kebabCaseToPascalCase("kebab-case-test-test-"),
      "KebabCaseTestTest"
    );
    assertEquals(
      kebabCaseToPascalCase("-kebab-case-test-test-"),
      "KebabCaseTestTest"
    );
    assertEquals(
      kebabCaseToPascalCase("kebabCaseTestTest"),
      "KebabCaseTestTest"
    );
  },
});

Deno.test({
  name: "pascalCaseToKebabCase",
  fn() {
    assertEquals(pascalCaseToKebabCase("PascalCase"), "pascal-case");
    assertEquals(pascalCaseToKebabCase("PascalCaseTest"), "pascal-case-test");
    assertEquals(
      pascalCaseToKebabCase("PascalCaseTestTest"),
      "pascal-case-test-test"
    );
    assertEquals(
      pascalCaseToKebabCase("PascalCaseTestTest"),
      "pascal-case-test-test"
    );
    assertEquals(
      pascalCaseToKebabCase("PascalCaseTestTest"),
      "pascal-case-test-test"
    );
    assertEquals(
      pascalCaseToKebabCase("PascalCaseTestTest"),
      "pascal-case-test-test"
    );
    assertEquals(
      pascalCaseToKebabCase("pascal-case-test-test"),
      "pascal-case-test-test"
    );
  },
});

Deno.test({
  name: "camelCaseToPascalCase",
  fn() {
    assertEquals(camelCaseToPascalCase("camelCase"), "CamelCase");
    assertEquals(camelCaseToPascalCase("camelCaseTest"), "CamelCaseTest");
    assertEquals(
      camelCaseToPascalCase("camelCaseTestTest"),
      "CamelCaseTestTest"
    );
    assertEquals(
      camelCaseToPascalCase("camelCaseTestTest"),
      "CamelCaseTestTest"
    );
    assertEquals(
      camelCaseToPascalCase("camelCaseTestTest"),
      "CamelCaseTestTest"
    );
    assertEquals(
      camelCaseToPascalCase("camelCaseTestTest"),
      "CamelCaseTestTest"
    );
  },
});

Deno.test({
  name: "pascalCaseToCamelCase",
  fn() {
    assertEquals(pascalCaseToCamelCase("PascalCase"), "pascalCase");
    assertEquals(pascalCaseToCamelCase("PascalCaseTest"), "pascalCaseTest");
    assertEquals(
      pascalCaseToCamelCase("PascalCaseTestTest"),
      "pascalCaseTestTest"
    );
    assertEquals(
      pascalCaseToCamelCase("PascalCaseTestTest"),
      "pascalCaseTestTest"
    );
    assertEquals(
      pascalCaseToCamelCase("PascalCaseTestTest"),
      "pascalCaseTestTest"
    );
    assertEquals(
      pascalCaseToCamelCase("PascalCaseTestTest"),
      "pascalCaseTestTest"
    );
  },
});

Deno.test({
  name: "toTitleCase",
  fn() {
    assertEquals(toTitleCase("hello world"), "Hello World");
    assertEquals(toTitleCase("hello_world"), "Hello World");
    assertEquals(toTitleCase("hello-world"), "Hello World");
    assertEquals(toTitleCase("helloWorld"), "Hello World");
    assertEquals(toTitleCase("helloWorld"), "Hello World");
  },
});

Deno.test({
  name: "toConstantCase",
  fn() {
    assertEquals(toConstantCase("hello world"), "HELLO_WORLD");
    assertEquals(toConstantCase("hello_world"), "HELLO_WORLD");
    assertEquals(toConstantCase("hello-world"), "HELLO_WORLD");
    assertEquals(toConstantCase("helloWorld"), "HELLO_WORLD");
    assertEquals(toConstantCase("helloWorld"), "HELLO_WORLD");
  },
});
