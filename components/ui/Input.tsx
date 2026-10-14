"use client";

import { cn } from "@/lib/utils/cn";

const fieldBase =
  "w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-sky-blue focus:outline-none disabled:bg-cream";

export interface FieldWrapperProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FieldWrapperProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
          {label}
          {required && <span className="ml-0.5 text-playful-pink">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-soft">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <FieldWrapper
      label={label}
      htmlFor={inputId}
      error={error}
      hint={hint}
      required={props.required}
    >
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, error && "border-red-400 focus:border-red-400", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id || props.name;
  return (
    <FieldWrapper
      label={label}
      htmlFor={inputId}
      error={error}
      hint={hint}
      required={props.required}
    >
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, "min-h-28 resize-y", error && "border-red-400", className)}
        {...props}
      />
    </FieldWrapper>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Select({
  label,
  error,
  hint,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const inputId = id || props.name;
  return (
    <FieldWrapper
      label={label}
      htmlFor={inputId}
      error={error}
      hint={hint}
      required={props.required}
    >
      <select
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(fieldBase, "cursor-pointer appearance-none pr-10", error && "border-red-400", className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235b5b6b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
        }}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  );
}
