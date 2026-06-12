import { safeNumber } from "@/app/__utils/utils";

export const rapportToUnit = (value: number | undefined) =>
  safeNumber(value) / 1000;
