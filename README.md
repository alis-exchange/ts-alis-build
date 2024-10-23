# ts-alis-build

Alis Build utils for Javascript/Typescript

## Installation

```bash
npm install @alis-build/utils
```

## Usage

```typescript
import { strings, numbers, time, money } from "@alis-build/utils";
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