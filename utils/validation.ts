export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "");

export const validateRequired = (value: string, label: string) => {
  if (!value.trim()) return `${label} is required`;
  return undefined;
};
