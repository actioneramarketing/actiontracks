import { cn } from "@/lib/utils";

const inputClassName =
  "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm bg-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

interface BuilderFormFieldProps {
  label: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  hint?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function BuilderFormField({
  label,
  name,
  defaultValue,
  value,
  placeholder,
  type = "text",
  textarea = false,
  rows = 3,
  required,
  readOnly,
  disabled,
  hint,
  onChange,
  className,
}: BuilderFormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          rows={rows}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          className={inputClassName}
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          className={inputClassName}
        />
      )}
      {hint ? <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{hint}</p> : null}
    </div>
  );
}

export function BuilderSelectField({
  label,
  name,
  defaultValue,
  hint,
  children,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <select
        name={name}
        defaultValue={defaultValue}
        className={cn(inputClassName, "cursor-pointer")}
      >
        {children}
      </select>
      {hint ? <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">{hint}</p> : null}
    </div>
  );
}

export { inputClassName as builderInputClassName };
