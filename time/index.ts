import GoogleTypeDate from "npm:@alis-build/google-common-protos@latest/google/type/date_pb.js";
import Timestamp from "npm:@alis-build/google-common-protos@latest/google/protobuf/timestamp_pb.js";

/**
 * Parse a GoogleTypeDate or Timestamp instance into a Date instance
 *
 * @param time {GoogleTypeDate | Timestamp} - The time/date to parse
 * @returns {Date | null | undefined} The parsed Date instance, or null if the input is nullish
 */
export const parse = (
  obj?: GoogleTypeDate.Date | Timestamp.Timestamp
): Date | null => {
  // If time is nullish, return null
  if (!obj) {
    return null;
  }

  // If time is an instance of GoogleTypeDate, return a new Date instance
  if (obj instanceof GoogleTypeDate.Date) {
    return new Date(obj.getYear(), obj.getMonth() - 1, obj.getDay());
  }

  // If time is an instance of Timestamp, return a new Date instance
  if (obj instanceof Timestamp.Timestamp) {
    const secondsInMillis = obj.getSeconds() * 1000;
    const nanosInMillis = obj.getNanos() / 1000000;
    return new Date(secondsInMillis + nanosInMillis);
  }

  // If time is not an instance of GoogleTypeDate or Timestamp, return undefined
  return null;
};

/**
 * Encode a Date instance into a google.type.Date instance
 * @param date {Date} - The date to encode
 * @returns {GoogleTypeDate | null} The encoded Date instance, or null if the input is nullish
 */
export const encodeDate = (date: Date): GoogleTypeDate.Date | null => {
  if (!date) {
    return null;
  }

  const googleDate = new GoogleTypeDate.Date();
  googleDate.setYear(date.getFullYear());
  googleDate.setMonth(date.getMonth() + 1);
  googleDate.setDay(date.getDate());

  return googleDate;
};

/**
 * Encode a Date instance into a google.protobuf.Timestamp instance
 * @param date {Date} - The date to encode
 * @returns {Timestamp | null} The encoded Timestamp instance, or null if the input is nullish
 */
export const encodeTimestamp = (date: Date): Timestamp.Timestamp | null => {
  if (!date) {
    return null;
  }

  const timestamp = new Timestamp.Timestamp();
  timestamp.setSeconds(Math.floor(date.getTime() / 1000));
  timestamp.setNanos((date.getTime() % 1000) * 1000000);

  return timestamp;
};

/**
 * Format a distance between two dates in a human-readable format
 * @param start {GoogleTypeDate | Timestamp | Date} - The start date
 * @param end {GoogleTypeDate | Timestamp | Date} - Optional end date. If not provided, the current date is used
 * @param relative {boolean} - Whether to return a relative time string (e.g. "5 minutes ago") or an absolute time string (e.g. "5 minutes")
 * @returns {string} The formatted distance between the two dates
 */
export const formatDistance = (
  start: GoogleTypeDate.Date | Timestamp.Timestamp | Date,
  end?: GoogleTypeDate.Date | Timestamp.Timestamp | Date,
  relative = false
): string => {
  if (!start) {
    return "";
  }

  // Initialize null date
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  // If startDate is an instance of GoogleTypeDate, return a new Date instance
  if (start instanceof GoogleTypeDate.Date) {
    startDate = new Date(start.getYear(), start.getMonth() - 1, start.getDay());
  }

  // If startDate is an instance of Timestamp, return a new Date instance
  if (start instanceof Timestamp.Timestamp) {
    const secondsInMillis = start.getSeconds() * 1000;
    const nanosInMillis = start.getNanos() / 1000000;
    startDate = new Date(secondsInMillis + nanosInMillis);
  }

  // If startDate is an instance of Date, return a new Date instance
  if (start instanceof Date) {
    startDate = start;
  }

  if (end) {
    // If endDate is an instance of GoogleTypeDate, return a new Date instance
    if (end instanceof GoogleTypeDate.Date) {
      endDate = new Date(end.getYear(), end.getMonth() - 1, end.getDay());
    }

    // If endDate is an instance of Timestamp, return a new Date instance
    if (end instanceof Timestamp.Timestamp) {
      const secondsInMillis = end.getSeconds() * 1000;
      const nanosInMillis = end.getNanos() / 1000000;
      endDate = new Date(secondsInMillis + nanosInMillis);
    }

    // If endDate is an instance of Date, return a new Date instance
    if (end instanceof Date) {
      endDate = end;
    }
  } else {
    endDate = new Date();
  }

  // If start or end date is null, return an empty string
  if (!startDate || !endDate) {
    return "";
  }

  // Calculate the difference in seconds between the two dates
  const diffInSeconds = Math.floor(
    (endDate.getTime() - startDate.getTime()) / 1000
  );
  const isFuture = diffInSeconds < 0;
  const diff = Math.abs(diffInSeconds);

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
  ];

  if (diff < 5) {
    if (relative) {
      return "just now";
    }

    const plural = diff > 1 || diff == 0 ? "s" : "";
    return `${diff} second${plural}`;
  }

  for (const unit of units) {
    const unitValue = Math.floor(diff / unit.seconds);
    if (unitValue >= 1) {
      const plural = unitValue > 1 ? "s" : "";
      const timeString = `${unitValue} ${unit.name}${plural}`;

      if (relative) {
        return isFuture ? `in ${timeString}` : `${timeString} ago`;
      }

      return timeString;
    }
  }

  if (relative) {
    return isFuture ? "in a few seconds" : "a few seconds ago";
  }

  return "a few seconds";
};
