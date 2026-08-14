const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

/** Converts only presentation text; source values and calculations remain unchanged. */
export function toPersianDigits(value: string | number): string {
  return String(value)
    .replace(/[0-9]/g, (digit) => persianDigits.charAt(Number(digit)))
    .replace(/[٠-٩]/g, (digit) => persianDigits.charAt(arabicDigits.indexOf(digit)))
    .replace(/,/g, "٬");
}

export function formatPersianNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function formatPersianIndex(value: number): string {
  return toPersianDigits(String(value).padStart(2, "0"));
}
