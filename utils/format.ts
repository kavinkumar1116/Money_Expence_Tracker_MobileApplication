export const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);

export const friendlyDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));

export const monthName = (month: number, year: number) =>
  new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
