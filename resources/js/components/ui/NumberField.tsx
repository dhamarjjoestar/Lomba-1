export default function NumberField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
  hint,
  testId,
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
  hint?: string;
  testId?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {suffix && <span className="field-suffix">{suffix}</span>}
      </span>
      <span className="input-wrap">
        <input
          data-testid={testId}
          type="number"
          min={min}
          {...(max == null ? {} : { max })}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </span>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

