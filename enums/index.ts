/**
 * Returns only the string keys of an enum type (filters out reverse-mapped numeric keys).
 *
 * @template T - The enum object type
 * @param enumType - The enum to extract keys from
 * @returns An array of the enum's string keys
 */
export const getAllEnumKeys = <T extends object>(
  enumType: T
): Array<keyof T> => {
  // Object.keys includes both string names and numeric indices (reverse mappings)
  return (
    Object.keys(enumType)
      // Keep only names that are not numeric
      .filter((key) => isNaN(Number(key))) as Array<keyof T>
  );
};

/**
 * Retrieves all values of an enum as an array.
 *
 * @template T - The enum object type
 * @param enumType - The enum to extract values from
 * @returns An array of the enum's values (of type T[keyof T])
 */
export const getAllEnumValues = <T extends object>(
  enumType: T
): Array<T[keyof T]> => {
  // Map each string key to its corresponding enum value
  return getAllEnumKeys(enumType).map((key) => enumType[key]);
};

/**
 * Retrieves all [key, value] pairs of an enum as tuples.
 *
 * @template T - The enum object type
 * @param enumType - The enum to extract entries from
 * @returns An array of tuples, each containing [key, value]
 */
export const getAllEnumEntries = <T extends object>(
  enumType: T
): Array<[keyof T, T[keyof T]]> => {
  // Create a tuple for each string key and its value
  return getAllEnumKeys(enumType).map((key) => [key, enumType[key]]);
};

/**
 * Finds the enum key name corresponding to a given value.
 *
 * @template T - The enum object type
 * @param enumType - The enum to search
 * @param value - The value to find the matching key for
 * @returns The key (as keyof T) if found, otherwise undefined
 */
export const getEnumKeyByValue = <T extends object>(
  enumType: T,
  value: T[keyof T]
): keyof T | undefined => {
  // Search through all keys to match the provided value
  return (Object.keys(enumType) as Array<keyof T>).find(
    (key) => enumType[key] === value
  );
};

/**
 * Retrieves the enum value associated with a given key.
 *
 * @template T - The enum object type
 * @param enumType - The enum to search
 * @param key - The key to look up
 * @returns The corresponding value (T[keyof T]) or undefined if the key is invalid
 */
export const getEnumValueByKey = <T extends object>(
  enumType: T,
  key: keyof T
): T[keyof T] | undefined => {
  // Direct property access returns the enum value or undefined
  return enumType[key];
};
