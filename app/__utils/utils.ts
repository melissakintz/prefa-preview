export const safeArray = <T>(val: T[] | T) => {
  return Array.isArray(val) ? val : [val];
};

export const safeNumber = (val: unknown) => {
  if (!val) return 0;
  if (typeof val === "number") return val;

  if (typeof val === "string") {
    const number = Number(val);
    if (!isNaN(number)) return number;
    return 0;
  }

  if (typeof val === "object") {
    return 0;
  }

  if (typeof val === "boolean") {
    if (val) return 1;
    return 0;
  }
  return 0;
};
