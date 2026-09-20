import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock3,
  FileSearch,
  BrainCircuit,
  Info,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";

import AIExplanationCard from "../components/AIExplanationCard";
import RiskBadge from "../components/RiskBadge";
import ScoreGauge from "../components/ScoreGauge";

import {
  formatCurrency,
  formatDate,
} from "../utils/formatters";

import {
  getRiskStyles,
} from "../utils/riskStyles";

function AssessmentResultPage() {
  const { id } = useParams();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAssessment =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            `/applications/${id}`,
          );

        setData(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            "Unable to load this assessment.",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAssessment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCcw className="mx-auto h-7 w-7 animate-spin text-slate-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading assessment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertTriangle className="mx-auto text-red-500" />

        <h2 className="mt-4 text-xl font-semibold text-red-900">
          Assessment unavailable
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>

        <button
          type="button"
          onClick={
            loadAssessment
          }
          className="mt-5 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    application,
    assessment,
  } = data;

  const styles =
    getRiskStyles(
      assessment.riskLevel,
    );

  const components = [
    {
      label:
        "Income Stability",
      score:
        assessment.components
          .incomeStability,
    },
    {
      label:
        "Debt Capacity",
      score:
        assessment.components
          .debtCapacity,
    },
    {
      label:
        "Payment Behaviour",
      score:
        assessment.components
          .paymentBehaviour,
    },
    {
      label:
        "Cash Flow Stability",
      score:
        assessment.components
          .cashFlowStability,
    },
    {
      label:
        "Account Stability",
      score:
        assessment.components
          .accountStability,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/assessments/new"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />

          New assessment
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock3 size={14} />

          {formatDate(
            application.createdAt,
          )}
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-950 px-6 py-5 text-white sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-slate-400">
                <ShieldCheck
                  size={15}
                  className="text-cyan-300"
                />

                CREDIT INTELLIGENCE
                ASSESSMENT
              </div>

              <h2 className="mt-2 text-2xl font-semibold">
                {
                  application.applicantName
                }
              </h2>

              <p className="mt-1 font-mono text-xs text-slate-400">
                {
                  application.applicationReference
                }
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs leading-5 text-slate-400">
              Prototype configurable
              rules
              <br />
              Human review required
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[320px_1fr]">
          <div className="flex flex-col items-center justify-center rounded-3xl bg-slate-50 p-6">
            <ScoreGauge
              score={
                assessment.totalScore
              }
              riskLevel={
                assessment.riskLevel
              }
            />

            <RiskBadge
              riskLevel={
                assessment.riskLevel
              }
              large
            />

            <p className="mt-4 max-w-[250px] text-center text-xs leading-5 text-slate-500">
              Higher scores represent
              stronger observed
              financial signals under
              this prototype's
              configurable rules.
            </p>
          </div>

          <div>
            <div className="flex items-start gap-3">
              <div
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  styles.light,
                  styles.text,
                ].join(" ")}
              >
                <FileSearch
                  size={19}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Assessment outcome
                </p>

                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  {
                    assessment.riskLevel
                  }
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  This classification
                  describes the
                  financial signals
                  observed by the
                  prototype scoring
                  rules. It is not an
                  approval or rejection
                  recommendation.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {components.map(
                (component) => (
                  <ComponentBar
                    key={
                      component.label
                    }
                    label={
                      component.label
                    }
                    score={
                      component.score
                    }
                  />
                ),
              )}
            </div>

            <div className="mt-7 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <span className="text-sm font-semibold text-slate-700">
                Total Credit
                Intelligence Score
              </span>

              <span className="text-xl font-semibold text-slate-950">
                {
                  assessment.totalScore
                }

                <span className="text-sm font-medium text-slate-400">
                  {" "}
                  / 100
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SignalCard
          type="positive"
          title="Positive Signals"
          subtitle="Factors strengthening the observed profile"
          items={
            assessment.positiveFactors
          }
        />

        <SignalCard
          type="risk"
          title="Risk / Attention Signals"
          subtitle="Factors that may warrant additional review"
          items={
            assessment.riskFactors
          }
        />
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-start gap-4 border-b border-slate-100 p-6 sm:p-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Calculator size={20} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-950">
              Calculation
              Transparency
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Every numerical point can
              be traced back to a
              supplied input and a
              configurable prototype
              scoring rule.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <TableHeader>
                  Component
                </TableHeader>

                <TableHeader>
                  Factor
                </TableHeader>

                <TableHeader>
                  Observed value
                </TableHeader>

                <TableHeader>
                  Points
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {assessment.calculationDetails.map(
                (
                  detail,
                  index,
                ) => (
                  <tr
                    key={`${detail.factor}-${index}`}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <TableCell>
                      <span className="font-medium text-slate-700">
                        {
                          detail.component
                        }
                      </span>
                    </TableCell>

                    <TableCell>
                      {detail.factor}
                    </TableCell>

                    <TableCell>
                      <span className="font-mono text-xs text-slate-600">
                        {String(
                          detail.value,
                        )}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-slate-950">
                        {
                          detail.points
                        }
                      </span>

                      <span className="text-slate-400">
                        {" "}
                        /{" "}
                        {
                          detail.maxPoints
                        }
                      </span>
                    </TableCell>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <FileSearch size={19} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-950">
              Financial Profile
            </h3>

            <p className="text-xs text-slate-400">
              Submitted application
              data
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <ProfileItem
            label="Employment"
            value={
              application.employmentType
            }
          />

          <ProfileItem
            label="Employment duration"
            value={`${application.employmentMonths} months`}
          />

          <ProfileItem
            label="Monthly income"
            value={formatCurrency(
              application.monthlyIncome,
            )}
          />

          <ProfileItem
            label="Requested amount"
            value={formatCurrency(
              application.requestedAmount,
            )}
          />

          <ProfileItem
            label="Existing monthly debt"
            value={formatCurrency(
              application.existingMonthlyDebt,
            )}
          />

          <ProfileItem
            label="Average balance"
            value={formatCurrency(
              application.averageMonthlyBalance,
            )}
          />

          <ProfileItem
            label="Monthly credits"
            value={formatCurrency(
              application.monthlyCredits,
            )}
          />

          <ProfileItem
            label="Monthly debits"
            value={formatCurrency(
              application.monthlyDebits,
            )}
          />

          <ProfileItem
            label="Income regularity"
            value={
              application.incomeRegularity
            }
          />

          <ProfileItem
            label="Utility payment rate"
            value={`${application.utilityPaymentRate}%`}
          />

          <ProfileItem
            label="Missed payments"
            value={
              application.missedPayments
            }
          />

          <ProfileItem
            label="Account age"
            value={`${application.accountAgeMonths} months`}
          />
        </div>
      </section>

      <div className="mt-6">
        <AIExplanationCard
          applicationId={
            application.id
          }
          initialExplanation={
            assessment.aiExplanation
          }
        />
      </div>

      <section className="mt-6 rounded-3xl border border-cyan-100 bg-cyan-50/60 p-5">
        <div className="flex gap-3">
          <Info
            size={19}
            className="mt-0.5 shrink-0 text-cyan-700"
          />

          <div>
            <p className="text-sm font-semibold text-cyan-900">
              Decision-support only
            </p>

            <p className="mt-1 text-xs leading-5 text-cyan-800/80">
              UnderRight is a
              hackathon prototype using
              synthetic demonstration
              data and configurable
              rules. A production
              lending system would
              require regulatory review,
              validated models, fairness
              testing, governance and
              continuous monitoring.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Link
          to="/assessments/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft size={16} />

          New assessment
        </Link>

        <div className="flex flex-wrap gap-3">
    <Link
      to={`/applications/${application.id}/copilot`}
      className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      <BrainCircuit size={17} />

      Open Underwriter Copilot
    </Link>

        <Link
          to="/applications"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Application history

          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
    </div>
  );
}

function ComponentBar({
  label,
  score,
}) {
  const percent =
    Math.min(
      100,
      Math.max(
        0,
        (Number(score) / 20) *
          100,
      ),
    );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-950">
          {score}
          <span className="font-normal text-slate-400">
            {" "}
            / 20
          </span>
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}

function SignalCard({
  type,
  title,
  subtitle,
  items,
}) {
  const positive =
    type === "positive";

  return (
    <section
      className={[
        "rounded-3xl border bg-white p-6 sm:p-7",
        positive
          ? "border-emerald-100"
          : "border-amber-100",
      ].join(" ")}
    >
      <div className="flex gap-3">
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            positive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600",
          ].join(" ")}
        >
          {positive ? (
            <CheckCircle2
              size={19}
            />
          ) : (
            <AlertTriangle
              size={19}
            />
          )}
        </div>

        <div>
          <h3 className="font-semibold text-slate-950">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      {items?.length > 0 ? (
        <div className="mt-6 space-y-3">
          {items.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex gap-3 rounded-xl bg-slate-50 p-3.5"
              >
                <span
                  className={[
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    positive
                      ? "bg-emerald-500"
                      : "bg-amber-500",
                  ].join(" ")}
                />

                <p className="text-sm leading-6 text-slate-600">
                  {item}
                </p>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          No material signals in this
          category were generated by
          the prototype rules.
        </div>
      )}
    </section>
  );
}

function TableHeader({
  children,
}) {
  return (
    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </th>
  );
}

function TableCell({
  children,
}) {
  return (
    <td className="px-6 py-4 text-sm text-slate-600">
      {children}
    </td>
  );
}

function ProfileItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value ?? "—"}
      </p>
    </div>
  );
}

export default AssessmentResultPage;