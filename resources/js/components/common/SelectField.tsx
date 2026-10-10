function SelectField({
  label,
  value,
  options,
  onChange,
  hint,
  testId,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  hint?: string;
  testId: string;
}) {
  return (
    <label className="field field-select">
      <span className="field-label">{label}</span>

      <select
        data-testid={testId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export default SelectField;