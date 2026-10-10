function sanitizeNumeric(value: string): string {
  const normalized = value.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const [head, ...tail] = normalized.split(".");
  return tail.length ? `${head}.${tail.join("").slice(0, 6)}` : head;
}

function Field({
  label,
  value,
  onChange,
  suffix,
  hint,
  testId,
  readOnly = false,
  numericOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  suffix?: string;
  hint?: string;
  testId: string;
  readOnly?: boolean;
  numericOnly?: boolean;
}) {
  return (
    <label className={`field ${numericOnly ? "field-numeric" : ""}`}>
      <span className="field-label">
        {label}
        {suffix && <span className="field-suffix">{suffix}</span>}
      </span>
      <span className="input-wrap">
        <input
          data-testid={testId}
          value={value}
          readOnly={readOnly}
          inputMode={numericOnly ? "decimal" : undefined}
          pattern={numericOnly ? "[0-9.]*" : undefined}
          onChange={(event) =>
            onChange?.(numericOnly ? sanitizeNumeric(event.target.value) : event.target.value)
          }
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </span>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export default Field;
