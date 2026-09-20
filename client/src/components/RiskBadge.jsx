import { getRiskStyles } from "../utils/riskStyles";

function RiskBadge({
  riskLevel,
  large = false,
}) {
  const styles =
    getRiskStyles(riskLevel);

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border font-semibold",
        styles.badge,
        large
          ? "px-4 py-2 text-sm"
          : "px-2.5 py-1 text-xs",
      ].join(" ")}
    >
      {riskLevel}
    </span>
  );
}

export default RiskBadge;