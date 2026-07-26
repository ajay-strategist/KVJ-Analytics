/**
 * Shared admin validation — centralized, composable rules (Zod-shaped, dependency-free).
 * NOTE: npm registry access is blocked in this environment, so react-hook-form + zod could not be
 * installed. This lightweight layer mirrors their ergonomics (rule composition + a resolver-style
 * `validate`) so every admin form shares one validation system now, and can migrate to Zod later by
 * swapping `FieldSchema` for a `z.object(...)` with minimal changes.
 */
export type FieldValue = unknown;
export type Rule = (value: FieldValue, all?: Record<string, FieldValue>) => string | null;
export type FieldSchema = Record<string, Rule[]>;

const isEmpty = (v: FieldValue) =>
  v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

export const required = (msg = "This field is required"): Rule => (v) => (isEmpty(v) ? msg : null);
export const minLen = (n: number, msg?: string): Rule => (v) =>
  typeof v === "string" && v.length < n ? msg ?? `Must be at least ${n} characters` : null;
export const maxLen = (n: number, msg?: string): Rule => (v) =>
  typeof v === "string" && v.length > n ? msg ?? `Must be at most ${n} characters` : null;
export const email = (msg = "Enter a valid email address"): Rule => (v) =>
  isEmpty(v) || (typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ? null : msg;
export const phone = (msg = "Enter a valid phone number"): Rule => (v) =>
  isEmpty(v) || (typeof v === "string" && /^[+\d][\d\s-]{6,}$/.test(v)) ? null : msg;
export const url = (msg = "Enter a valid URL"): Rule => (v) =>
  isEmpty(v) || (typeof v === "string" && /^(https?:\/\/|\/)/.test(v)) ? null : msg;
export const slug = (msg = "Use lowercase letters, numbers and hyphens"): Rule => (v) =>
  isEmpty(v) || (typeof v === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) ? null : msg;
export const pattern = (re: RegExp, msg: string): Rule => (v) =>
  isEmpty(v) || (typeof v === "string" && re.test(v)) ? null : msg;
export const isNumber = (msg = "Enter a valid number"): Rule => (v) =>
  isEmpty(v) || (!Number.isNaN(Number(v))) ? null : msg;
export const min = (n: number, msg?: string): Rule => (v) =>
  isEmpty(v) || Number(v) >= n ? null : msg ?? `Must be at least ${n}`;
export const max = (n: number, msg?: string): Rule => (v) =>
  isEmpty(v) || Number(v) <= n ? null : msg ?? `Must be at most ${n}`;
export const match = (field: string, msg = "Values do not match"): Rule => (v, all) =>
  all && v === all[field] ? null : msg;
export const custom = (fn: (v: FieldValue, all?: Record<string, FieldValue>) => boolean, msg: string): Rule =>
  (v, all) => (fn(v, all) ? null : msg);

/** Run a field's rules, returning the first error (or null). */
export function runRules(rules: Rule[], value: FieldValue, all?: Record<string, FieldValue>): string | null {
  for (const r of rules) { const e = r(value, all); if (e) return e; }
  return null;
}

/** Resolver-style: validate all fields against a schema → `{ field: message }`. */
export function validate(schema: FieldSchema, values: Record<string, FieldValue>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of Object.keys(schema)) {
    const e = runRules(schema[key], values[key], values);
    if (e) errors[key] = e;
  }
  return errors;
}
