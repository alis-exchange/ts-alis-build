import GoogleProtobufDuration from "npm:@alis-build/google-common-protos@latest/google/protobuf/duration_pb.js";

export interface TimeUnits {
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
}

/**
 * Represents a duration of time
 * @param units {TimeUnits} - The time units to initialize the duration with
 * @returns {Duration} The Duration instance
 */
export class Duration {
  private hours: number;
  private minutes: number;
  private seconds: number;
  private milliseconds: number;
  private microseconds: number;
  private nanoseconds: number;

  constructor(units: TimeUnits = {}) {
    this.hours = units?.hours ?? 0;
    this.minutes = units?.minutes ?? 0;
    this.seconds = units?.seconds ?? 0;
    this.milliseconds = units?.milliseconds ?? 0;
    this.microseconds = units?.microseconds ?? 0;
    this.nanoseconds = units?.nanoseconds ?? 0;
  }

  /**
   * Returns the total number of hours in the duration
   */
  getTotalHours(): number {
    return this.getTotalNanoseconds() / 3600e9;
  }

  /**
   * Returns the total number of minutes in the duration
   */
  getTotalMinutes(): number {
    return this.getTotalNanoseconds() / 60e9;
  }

  /**
   * Returns the total number of seconds in the duration
   */
  getTotalSeconds(): number {
    return this.getTotalNanoseconds() / 1e9;
  }

  /**
   * Returns the total number of milliseconds in the duration
   */
  getTotalMilliseconds(): number {
    return this.getTotalNanoseconds() / 1e6;
  }

  /**
   * Returns the total number of microseconds in the duration
   */
  getTotalMicroseconds(): number {
    return this.getTotalNanoseconds() / 1e3;
  }

  /**
   * Returns the total number of nanoseconds in the duration
   */
  getTotalNanoseconds(): number {
    return (
      this.hours * 3600e9 +
      this.minutes * 60e9 +
      this.seconds * 1e9 +
      this.milliseconds * 1e6 +
      this.microseconds * 1e3 +
      this.nanoseconds
    );
  }

  /**
   * Returns a string representation of the duration.
   * The string is formatted as "Xh Ym Zs Ams Bµs Cns"
   * where X, Y, Z, A, B, and C are the respective time units where:
   *    - `Xh`: X hours
   *    - `Ym`: Y minutes
   *    - `Zs`: Z seconds
   *    - `Ams`: A milliseconds
   *    - `Bµs`: B microseconds
   *    - `Cns`: C nanoseconds
   */
  toString(): string {
    const parts: string[] = [];

    if (this.hours) {
      parts.push(`${this.hours}h`);
    }
    if (this.minutes) {
      parts.push(`${this.minutes}m`);
    }
    if (
      this.seconds ||
      (!this.hours &&
        !this.minutes &&
        !this.milliseconds &&
        !this.microseconds &&
        !this.nanoseconds)
    ) {
      parts.push(`${this.seconds}s`);
    }
    if (this.milliseconds) {
      parts.push(`${this.milliseconds}ms`);
    }
    if (this.microseconds) {
      parts.push(`${this.microseconds}µs`);
    }
    if (this.nanoseconds) {
      parts.push(`${this.nanoseconds}ns`);
    }

    return parts.join(" ");
  }

  toDuration(): GoogleProtobufDuration.Duration {
    return encode(this)!;
  }
}

/**
 * Parse a google.protobuf.Duration instance into a {Duration} instance
 * @param duration {GoogleProtobufDuration.Duration} - The duration to parse
 * @returns {Duration} The parsed Duration instance
 */
export const parse = (
  duration?: GoogleProtobufDuration.Duration
): Duration | null => {
  if (!duration) {
    return null;
  }

  // Convert the duration into total nanoseconds
  let totalNanoseconds =
    Number(duration.getSeconds()) * 1e9 + duration.getNanos();

  // Break down totalNanoseconds into individual units
  const hours = Math.floor(totalNanoseconds / 3600e9);
  totalNanoseconds %= 3600e9;

  const minutes = Math.floor(totalNanoseconds / 60e9);
  totalNanoseconds %= 60e9;

  const seconds = Math.floor(totalNanoseconds / 1e9);
  totalNanoseconds %= 1e9;

  const milliseconds = Math.floor(totalNanoseconds / 1e6);
  totalNanoseconds %= 1e6;

  const microseconds = Math.floor(totalNanoseconds / 1e3);
  totalNanoseconds %= 1e3;

  const nanoseconds = totalNanoseconds;

  // Create a TimeUnits object
  const units: TimeUnits = {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: milliseconds,
    microseconds: microseconds,
    nanoseconds: nanoseconds,
  };

  // Return a Duration instance
  return new Duration(units);
};

/**
 * Encode a TimeUnits object into a google.protobuf.Duration instance
 * @param units {TimeUnits} - The time units to encode
 * @returns {GoogleProtobufDuration.Duration} The encoded Duration instance
 */
export const encode = (
  duration: Duration
): GoogleProtobufDuration.Duration | null => {
  if (!duration) {
    return null;
  }

  if (!(duration instanceof Duration)) {
    throw new Error("Invalid duration");
  }

  // Use the total nanoseconds from the Duration instance
  const totalNanoseconds = duration.getTotalNanoseconds();

  // Convert total nanoseconds to seconds and remaining nanoseconds
  const totalSeconds = Math.floor(totalNanoseconds / 1e9);
  const remainingNanoseconds = totalNanoseconds % 1e9;

  // Construct the Duration object
  const protoDuration = new GoogleProtobufDuration.Duration();
  protoDuration.setSeconds(totalSeconds);
  protoDuration.setNanos(remainingNanoseconds);

  return protoDuration;
};
