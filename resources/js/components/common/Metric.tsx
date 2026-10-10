function Metric({
  label,
  value,
  unit,
  note,
  tone = "ink",
}: {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  tone?: "ink" | "gold" | "green" | "muted";
}) {
  return (
    <div className="metric">
      <p className="eyebrow">{label}</p>
      <p className={`metric-value metric-${tone}`}>
        {value}
        {unit && <span className="metric-unit">{unit}</span>}
      </p>
      {note && <p className="metric-note">{note}</p>}
    </div>
  );
}

export default Metric;
