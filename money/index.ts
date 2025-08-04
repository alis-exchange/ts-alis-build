import Money from "npm:@alis-build/google-common-protos@latest/google/type/money_pb.js";

/**
 * Parse a google.type.Money instance into a number
 *
 * @param money {google.type.Money} - The money to parse
 * @returns {number | null} The parsed number, or null if the input is nullish
 */
export const parse = (money: Money.Money): number | null => {
  // If money is nullish, return null
  if (!money) {
    return null;
  }

  const units = money.getUnits();
  const nanos = money.getNanos();

  return units + nanos / 1e9;
};

/**
 * Encode a number into a google.type.Money instance
 *
 * NOTE: This function has limitations due to JavaScript's native floating-point
 * precision. It will throw an error for values outside the safe integer range
 * (`Number.MAX_SAFE_INTEGER`). For high-precision financial calculations,
 * using a dedicated decimal library is recommended.
 *
 * @param currency The 3-letter ISO 4217 code (e.g., "USD").
 * @param value The monetary amount as a JS number (e.g., -1.75).
 * @returns A google.type.Money protobuf message.
 * @throws {RangeError} If the value is outside JavaScript's safe integer range.
 * @throws {Error} If an impossible state with mismatched signs occurs.
 */
export const encode = (currency: string, value: number): Money.Money | null => {
  // Trim any whitespaces in the currency
  currency = currency.trim();

  // Ensure both currency and value are provided
  if (!currency || value === undefined || value === null) {
    return null;
  }

  // Prevent precision loss by checking if the value is in a safe range.
  if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER) {
    throw new RangeError(
      "Input value is outside the safe integer range and will lose precision."
    );
  }

  // Extract the whole-unit part, truncating toward zero.
  let units = Math.trunc(value);

  // Calculate the fractional part in nanos and round it.
  let nanos = Math.round((value - units) * 1e9);

  // Handle carry-over if rounding pushed nanos to a full unit.
  if (nanos === 1_000_000_000) {
    units += 1;
    nanos = 0;
  } else if (nanos === -1_000_000_000) {
    units -= 1;
    nanos = 0;
  }

  // Ensure the signs of units and nanos are consistent.
  if ((units > 0 && nanos < 0) || (units < 0 && nanos > 0)) {
    throw new Error(
      `Impossible state: units (${units}) and nanos (${nanos}) have mismatched signs.`
    );
  }

  // 6) Build and return the protobuf message.
  const money = new Money.Money();
  money.setCurrencyCode(currency);
  money.setUnits(units);
  money.setNanos(nanos);
  return money;
};

/**
 * Takes a google.type.Money object and returns a string formatted as currency.
 *
 * @param money {google.type.Money} - The money object to format
 * @returns {string}
 */
export const format = (money?: Money.Money): string => {
  if (!money) {
    return "0.0";
  }

  // Create a JS number formatter
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.getCurrencyCode(),
  });

  return currencyFormatter.format(parse(money) ?? 0.0);
};
