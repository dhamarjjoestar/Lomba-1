import { evidenceLabel } from "../../utils/decision";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const tone =
    normalized.includes("LULUS") ||
    normalized === "VALIDATED" ||
    normalized === "REPORTED"
      ? "pass"
      : normalized.includes("GAGAL") || normalized === "NOT_SUPPORTED"
        ? "fail"
        : normalized.includes("DIRECT") || normalized.includes("LITERATURE")
          ? "literature"
          : normalized.includes("ASSUMPTION") ||
              normalized.includes("CONDITIONAL")
            ? "gold"
            : "neutral";

  return (
    <span className={`status-badge status-${tone}`}>
      <span className="status-dot" />
      {evidenceLabel(status)}
    </span>
  );
}
