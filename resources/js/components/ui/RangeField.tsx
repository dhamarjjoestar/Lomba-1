export default function RangeField({
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
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
  hint: string;
  testId: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="range-field">
      <div className="range-head">
        <div>
          <p className="field-label">{label}</p>
          <p className="field-hint">{hint}</p>
        </div>
        <strong>
          {value.toFixed(step < 1 ? 2 : 0)}
          {suffix}
        </strong>
      </div>
      <input
        data-testid={testId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{
          background: `linear-gradient(90deg, #b58a36 ${percent}%, #d8d1c5 ${percent}%)`,
        }}
      />
      <div className="range-scale">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

