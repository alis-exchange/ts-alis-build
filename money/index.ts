import Money from "npm:@alis-build/google-common-protos@latest/google/type/money_pb.js";
import { modf } from "../numbers/index.ts";

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
 * @param currency {string} - The currency code
 * @param value {number} - The number to encode
 * @returns {Money | null} The encoded Money instance, or null if the input is nullish
 */
export const encode = (currency: string, value: number): Money.Money | null => {
  if (!currency || !value) {
    return null;
  }

  const [units, nanos] = modf(value);

  const rawNanos = nanos * 1e9;
  const absNanosString = rawNanos?.toString()?.split(".")[0];
  const absNanos = absNanosString ? parseInt(absNanosString) : 0;

  const money = new Money.Money();
  money.setCurrencyCode(currency);
  money.setUnits(units);
  money.setNanos(absNanos);

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
