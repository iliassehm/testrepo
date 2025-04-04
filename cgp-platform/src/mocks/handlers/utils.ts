import type { Amount } from "../../types";

export function mockRandomDateBeforeToday(today = new Date()): Date {
  const todayTimestamp = today.getTime();
  const randomTimestamp = Math.floor(Math.random() * todayTimestamp);
  return new Date(randomTimestamp);
}

export function mockRandomPhoneNumber(): string {
  return Math.floor(Math.random() * 1000000000).toString();
}

export function mockRandomAmount(
  max = 1000000000,
  instrument = "EUR"
): Required<Amount> {
  return { value: Math.floor(Math.random() * max), instrument, grossValue: 0 };
}

export function mockArrayFromNumber<T>(length: number, callback: () => T): T[] {
  return Array.from({ length }, callback);
}
