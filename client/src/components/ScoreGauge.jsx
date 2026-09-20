import { getRiskStyles } from "../utils/riskStyles";

function ScoreGauge({
  score,
  riskLevel,
}) {
  const safeScore = Math.max(
    0,
    Math.min(100, Number(score || 0)),
  );

  const radius = 78;
  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (safeScore / 100) *
      circumference;

  const styles =
    getRiskStyles(riskLevel);

  return (
    <div className="relative flex h-[220px] w-[220px] items-center justify-center">
      <svg
        className="-rotate-90"
        width="220"
        height="220"
        viewBox="0 0 220 220"
      >
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="16"
        />

        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={
            circumference
          }
          strokeDashoffset={offset}
          className={
            styles.text
          }
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-5xl font-semibold tracking-tight text-slate-950">
          {safeScore}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-400">
          / 100
        </p>

        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Credit Score
        </p>
      </div>
    </div>
  );
}

export default ScoreGauge;