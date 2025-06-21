import { toZonedTime } from "date-fns-tz";
import dayjs from "dayjs";
import { DateTime } from "luxon";

/**
 * Convert all digits in a string to english
 * @param {string} num
 * @returns {string}
 */
export const convertToEnglishDigit = (num: string): string => {
  return num
    .replace(/[\u0660-\u0669]/g, (c) => (c.charCodeAt(0) - 0x0660).toString())
    .replace(/[\u06f0-\u06f9]/g, (c) => (c.charCodeAt(0) - 0x06f0).toString());
};

/**
 *
 * @param number int
 * @returns Formated number as string
 */
export const numberFormat = (number: number) => {
  return number !== null
    ? number
        .toString()
        .replace(/\D[, .]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";
};

/**
 *
 * @param {string} str
 * @returns {string}
 */
export const removeWhiteSpaceFromString = (str: string): string => {
  return str && str.split(/\s+/).join("");
};

/**
 * Get the current date/time in Central European Time (CET/CEST)
 * @returns {Date}
 */
export const getNowInCET = (): Date => {
  return toZonedTime(new Date(), "Europe/Berlin");
};

/**
 * Format a picked date and time as 'YYYY-MM-DD HH:mm', preserving the user's selection exactly.
 * @param {Date} date - The picked date
 * @param {Date} time - The picked time
 * @returns {string}
 */
export const formatPickedDateTime = (date: Date, time: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * Format a picked date and time as 'YYYY-MM-DD HH:mm' using dayjs, preserving the user's selection exactly.
 * @param {Date} date - The picked date
 * @param {Date} time - The picked time
 * @returns {string}
 */
export const formatPickedDateTimeDayjs = (date: Date, time: Date): string => {
  // Combine date and time into a new Date object
  const combined = new Date(date);
  combined.setHours(time.getHours());
  combined.setMinutes(time.getMinutes());
  combined.setSeconds(0);
  combined.setMilliseconds(0);
  return dayjs(combined).format("YYYY-MM-DD HH:mm");
};

/**
 * Formats selected date and time into a CET-based ISO string.
 * @param date Selected date (from DatePicker)
 * @param time Selected time (from DatePicker)
 * @returns ISO string in CET timezone
 */
export function formatPickedDateTimeCET(date: Date, time: Date): string {
  const dt = DateTime.fromObject(
    {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: time.getHours(),
      minute: time.getMinutes(),
    },
    { zone: "Europe/Berlin" }
  );

  return dt.toISO() ?? "";
}

/**
 * Converts a CET-based ISO string to local time and returns separate date and time strings.
 * @param cetISO ISO string (in Europe/Berlin timezone)
 * @returns { date: string, time: string }
 */
export function convertCETToLocal(cetISO: string | null | undefined): {
  date: string;
  time: string;
} {
  if (!cetISO) return { date: "N/A", time: "N/A" };

  const dt = DateTime.fromISO(cetISO, { zone: "Europe/Berlin" }).setZone(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return {
    date: dt.toLocaleString(DateTime.DATE_MED), // e.g., "Jun 21, 2025"
    time: dt.toLocaleString(DateTime.TIME_SIMPLE), // e.g., "6:30 PM"
  };
}
