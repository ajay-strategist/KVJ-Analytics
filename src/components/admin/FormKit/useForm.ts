"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { type FieldSchema, validate } from "@/lib/admin/validators";

/** RHF-shaped form controller (dependency-free). See lib/admin/validators for the migration note. */
export interface FieldApi {
  name: string;
  value: unknown;
  error?: string;
  onChange: (v: unknown) => void;
  onBlur: () => void;
}
export interface FormApi<T extends Record<string, unknown>> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  submitted: boolean;
  isDirty: boolean;
  setValue: (name: string, value: unknown) => void;
  setValues: (partial: Partial<T>) => void;
  setError: (name: string, msg: string) => void;
  reset: (next?: Partial<T>) => void;
  field: (name: string) => FieldApi;
  handleSubmit: (e?: { preventDefault?: () => void }) => void;
}

export function useForm<T extends Record<string, unknown>>(opts: {
  initial: T;
  schema?: FieldSchema;
  onSubmit: (values: T) => void | Promise<void>;
}): FormApi<T> {
  const { initial, schema, onSubmit } = opts;
  const [values, setVals] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const valsRef = useRef(values);
  valsRef.current = values;
  const submittedRef = useRef(false);
  const touchedRef = useRef(touched);
  touchedRef.current = touched;

  const runValidate = useCallback((vals: T) => (schema ? validate(schema, vals) : {}), [schema]);

  const setValue = useCallback((name: string, value: unknown) => {
    setVals((prev) => {
      const next = { ...prev, [name]: value } as T;
      if (submittedRef.current || touchedRef.current[name]) {
        const all = runValidate(next);
        setErrors((e) => ({ ...e, [name]: all[name] || "" }));
      }
      return next;
    });
  }, [runValidate]);

  const setValues = useCallback((partial: Partial<T>) => setVals((prev) => ({ ...prev, ...partial })), []);
  const setError = useCallback((name: string, msg: string) => setErrors((e) => ({ ...e, [name]: msg })), []);
  const reset = useCallback((next?: Partial<T>) => {
    setVals({ ...initial, ...(next || {}) }); setErrors({}); setTouched({}); setSubmitted(false); submittedRef.current = false;
  }, [initial]);

  const onBlur = useCallback((name: string) => {
    setTouched((t) => ({ ...t, [name]: true }));
    const all = runValidate(valsRef.current);
    setErrors((e) => ({ ...e, [name]: all[name] || "" }));
  }, [runValidate]);

  const field = useCallback((name: string): FieldApi => ({
    name,
    value: (values as Record<string, unknown>)[name],
    error: errors[name] || undefined,
    onChange: (v: unknown) => setValue(name, v),
    onBlur: () => onBlur(name),
  }), [values, errors, setValue, onBlur]);

  const handleSubmit = useCallback((e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    setSubmitted(true); submittedRef.current = true;
    const all = runValidate(valsRef.current);
    setErrors(all);
    if (Object.values(all).some(Boolean)) return;
    setSubmitting(true);
    Promise.resolve(onSubmit(valsRef.current)).finally(() => setSubmitting(false));
  }, [runValidate, onSubmit]);

  const isDirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(initial), [values, initial]);

  return { values, errors, touched, isSubmitting, submitted, isDirty, setValue, setValues, setError, reset, field, handleSubmit };
}
