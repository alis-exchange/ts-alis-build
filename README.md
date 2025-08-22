# ts-alis-build

Alis Build utils for Javascript/Typescript

## Installation

```bash
npm install @alis-build/utils
```

## Usage

```typescript
import { money, strings, time, duration, enums, promises } from "@alis-build/utils";
```

### Time

1. `encodeTimestamp` - Converts a `Date` object to a `google.protobuf.Timestamp` object.
```typescript
time.encodeTimestamp(new Date())
```

2. `encodeDate` - Converts a `Date` object to a `google.type.Date` object.

```typescript
time.encodeDate(new Date())
```

3. `formatDistance` - Formats the distance between two dates.

```typescript
time.formatDistance(new Date(), new Date(), true)
```

Also accepts `google.protobuf.Timestamp` and `google.type.Date` objects.

4. `parse` - Parses a `google.protobuf.Timestamp` or `google.type.Date` object to a `Date` object.

```typescript
const timestamp = new Timestamp();
timestamp.setSeconds(1634294400);
timestamp.setNanos(0);
time.parse(timestamp)
```

### Money

1. `encode` - Converts a number to a `google.type.Money` object.

```typescript
money.encode("USD", 100.20)
```

2. `format` - Formats a `google.type.Money` object to a string.

```typescript
money.format(money.encode("USD", 100.20))
```

1. `parse` - Parses a `google.type.Money` object to a number.

```typescript
const moneyObj = new Money();
moneyObj.setCurrencyCode("USD");
moneyObj.setUnits(100);
moneyObj.setNanos(200000000);
money.parse(moneyObj)
```

### Duration

1. `Duration` - Custom Duration class to handle duration calculations.

```typescript
const duration = new duration.Duration({ hours: 1, minutes: 30, seconds: 30 });
```

2. `encode` - Converts a `Duration` to a `google.protobuf.Duration` object.

```typescript
const duration = new duration.Duration({ hours: 1, minutes: 30, seconds: 30 });

duration.encode()
```

1. `parse` - Parses a `google.protobuf.Duration` object to a `Duration`.

```typescript
const durationObj = new Duration();
durationObj.setSeconds(5400);

duration.parse(durationObj)
```


### Strings

1. `snakeCaseToCamelCase`
2. `camelCaseToSnakeCase`
3. `snakeCaseToKebabCase`
4. `kebabCaseToSnakeCase`
5. `camelCaseToKebabCase`
6. `kebabCaseToCamelCase`
7. `snakeCaseToPascalCase`
8. `pascalCaseToSnakeCase`
9. `kebabCaseToPascalCase`
10. `pascalCaseToKebabCase`
11. `camelCaseToPascalCase`
12. `pascalCaseToCamelCase`
13. `toTitleCase`
14. `toConstantCase`

### Enums

1. `getAllEnumKeys` - Returns all enum keys from a given enum.

```typescript
import { getAllEnumKeys } from "@alis-build/utils/enums";

enum MyEnum {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
}

const allEnumKeys = getAllEnumKeys(MyEnum);

console.log(allEnumKeys); // ["FIRST", "SECOND", "THIRD"]
```

2. `getAllEnumValues` - Returns all enum values from a given enum.

```typescript
import { getAllEnumValues } from "@alis-build/utils/enums";

enum MyEnum {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
}

const allEnumValues = getAllEnumValues(MyEnum);

console.log(allEnumValues); // [1, 2, 3]
```

3. `getAllEnumEntries` - Returns all enum entries (key-value pairs) from a given enum.

```typescript
import { getAllEnumEntries } from "@alis-build/utils/enums";

enum MyEnum {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
}

const allEnumEntries = getAllEnumEntries(MyEnum);

console.log(allEnumEntries); // [["FIRST", 1], ["SECOND", 2], ["THIRD", 3]]
```

4. `getEnumKeyByValue` - Returns the enum key for a given value.

```typescript
import { getEnumKeyByValue } from "@alis-build/utils/enums";

enum MyEnum {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
}

const enumKey = getEnumKeyByValue(MyEnum, 2);
console.log(enumKey); // "SECOND"
```

5. `getEnumValueByKey` - Returns the enum value for a given key.

```typescript
import { getEnumValueByKey } from "@alis-build/utils/enums";

enum MyEnum {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
}

const enumValue = getEnumValueByKey(MyEnum, "SECOND");

console.log(enumValue); // 2
```

### Promises

1. `Deferred` - Deferred represents a promise that can be resolved or rejected externally. Unlike a regular Promise where the resolution logic must be provided at construction time, a Deferred allows you to create a promise and control its settlement from outside.

```typescript
import { Deferred, DeferredState } from "@alis-build/utils/promises";

const deferred = new Deferred<string>();

// The promise can be awaited elsewhere
async function waitForResult() {
  const result = await deferred.promise;
  console.log('Got result:', result);
}

// And resolved from anywhere
setTimeout(() => {
  deferred.resolve('Hello, World!');
}, 1000);
```

Timeout support:

```typescript
const deferred = new Deferred<string>();

// Reject after 5 seconds with default error
deferred.setTimeout(5000);

// Or with custom timeout error
deferred.setTimeout(5000, new Error('Operation timed out'));

// The timeout is cleared if resolved before it expires
deferred.resolve('Completed in time!');
```

Cancellation support:

```typescript
const deferred = new Deferred<string>();

// Register cancellation callbacks
deferred.onCancel(() => {
  console.log('Deferred was cancelled');
  // Cleanup resources
});

// Cancel with optional reason
deferred.cancel('User cancelled the operation');
```

State inspection:

```typescript
const deferred = new Deferred<string>();

console.log(deferred.isPending);   // true
console.log(deferred.isSettled);   // false

deferred.resolve('done');

console.log(deferred.isResolved);  // true
console.log(deferred.isSettled);   // true
console.log(deferred.value);       // 'done'
console.log(deferred.duration);    // Time in ms from creation to settlement
```

2. `RetryableDeferred` - RetryableDeferred extends `Deferred` to add automatic retry capabilities for operations that may fail transiently.

```typescript
import { RetryableDeferred } from "@alis-build/utils/promises";

// Will retry up to 3 times with 1 second delay between attempts
const deferred = new RetryableDeferred(
  somePromise(),
  3,     // maxAttempts
  1000   // retryDelay in ms
);

try {
  const data = await deferred.promise;
  console.log('Success after', deferred.attemptCount, 'attempts');
} catch (error) {
  console.log('Failed after', deferred.attemptCount, 'attempts');
}
```