/**
 * Converts a string from snake_case to camelCase
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const snakeCaseToCamelCase = (str: string): string => {
  if (!str) {
    return str;
  }

  // Strip leading and trailing underscores
  str = str.replace(/^_+|_+$/g, "");

  return str.replace(/_([a-zA-Z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Converts a string from camelCase to snake_case
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const camelCaseToSnakeCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
};

/**
 * Converts a string from snakeCase to kebab-case
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const snakeCaseToKebabCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return str.replace(/_/g, "-");
};

/**
 * Converts a string from kebab-case to snake_case
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const kebabCaseToSnakeCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return str.replace(/-/g, "_");
};

/**
 * Converts a string from camelCase to kebab-case
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const camelCaseToKebabCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return camelCaseToSnakeCase(str).replace(/_/g, "-");
};

/**
 * Converts a string from kebab-case to camelCase
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const kebabCaseToCamelCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return snakeCaseToCamelCase(kebabCaseToSnakeCase(str));
};

/**
 * Converts a string from snake_case to PascalCase
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const snakeCaseToPascalCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return snakeCaseToCamelCase(str).replace(/^\w/, (c) => c.toUpperCase());
};

/**
 * Converts a string from PascalCase to snake_case
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const pascalCaseToSnakeCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return camelCaseToSnakeCase(str).replace(/^_+|_+$/g, "");
};

/**
 * Converts a string from PascalCase to camelCase
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const kebabCaseToPascalCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return kebabCaseToCamelCase(str).replace(/^\w/, (c) => c.toUpperCase());
};

/**
 * Converts a string from PascalCase to kebab-case
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const pascalCaseToKebabCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return camelCaseToKebabCase(str).replace(/^-+|-+$/g, "");
};

/**
 * Converts a string from camelCase to PascalCase
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const camelCaseToPascalCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return str.replace(/^\w/, (c) => c.toUpperCase());
};

/**
 * Converts a string from PascalCase to camelCase
 * @param str {string} - The string to convert
 * @returns {string} The converted string
 */
export const pascalCaseToCamelCase = (str: string): string => {
  if (!str) {
    return str;
  }

  return str.replace(/^\w/, (c) => c.toLowerCase());
};

/**
 * Converts a string to Title Case.
 * @param str - The string to convert.
 * @returns The Title Case version of the input string.
 */
export function toTitleCase(str: string): string {
  // Split the string into words
  const words = str
    // Handle camelCase and PascalCase
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    // Handle ALLCAPS to capitalize only first letter
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    // Replace underscores and hyphens with spaces
    .replace(/[_\-]+/g, " ")
    // Convert to lowercase
    .toLowerCase()
    // Split into words by spaces
    .split(/\s+/);

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );

  // Join the words with spaces
  return capitalizedWords.join(" ");
}

/**
 * Converts a string to CONSTANT_CASE.
 * @param str - The string to convert.
 * @returns The CONSTANT_CASE version of the input string.
 */
export function toConstantCase(str: string): string {
  // Split the string into words
  const words = str
    // Handle camelCase and PascalCase
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    // Handle ALLCAPS acronyms followed by lowercase letters
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    // Replace spaces, hyphens, and underscores with a single underscore
    .replace(/[\s\-_]+/g, "_")
    // Convert to uppercase
    .toUpperCase();

  return words;
}
