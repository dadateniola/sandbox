type StringFormat =
  | "lowercase"
  | "uppercase"
  | "capitalize" // Capitalize first letter of string
  | "titlecase"; // Capitalize first letter of each word

/**
 * Formats a string according to the specified format type.
 *
 * @param {string} str - The string to format.
 * @param {StringFormat} format - The format type to apply.
 * @param {boolean} transformRest - Whether to lowercase the remaining characters (default: true).
 * @returns {string} The formatted string.
 */
export function formatString(
  str: string,
  format: StringFormat,
  transformRest: boolean = true
): string {
  switch (format) {
    case "lowercase":
      return str.toLowerCase();

    case "uppercase":
      return str.toUpperCase();

    case "capitalize":
      return transformRest
        ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        : str.charAt(0).toUpperCase() + str.slice(1);

    case "titlecase":
      return str
        .split(" ")
        .map((word) =>
          transformRest
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

    default:
      return str;
  }
}
