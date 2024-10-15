/**
 * Deconstructs a number into its integer and fractional parts.
 * Example:
 *
 *   const [units, nanos] = Modf(123.456);
 *
 * @param value - number to deconstruct
 * @returns {number[]}
 */
export const modf = (value: number): [units: number, nanos: number] => {
  // return integer part - may be negative
  const trunc = () => {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  };

  // return fraction part
  const frac = () => {
    const nanos = value - Math.trunc(value);

    return value < 0 ? -nanos : nanos;
  };

  return [trunc(), frac()];
};
