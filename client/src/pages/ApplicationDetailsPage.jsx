import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  UserRound,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";

import AIExplanationCard from "../components/AIExplanationCard";
import RiskBadge from "../components/RiskBadge";

import {
  formatCurrency,
  formatDate,
} from "../utils/formatters";

function ApplicationDetailsPage() {
  const { id } = useParams();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        const response =
          await api.get(
            `/applications/${id}`,
          );

        setData(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            "Unable to load application.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-sm text-slate-500">
        Loading application...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  const {
    application,
    assessment,
  } = data;

  const components = [
    [
      "Income Stability",
      assessment.components
        .incomeStability,
    ],
    [
      "Debt Capacity",
      assessment.components
        .debtCapacity,
    ],
    [
      "Payment Behaviour",
      assessment.components
        .paymentBehaviour,
    ],
    [
      "Cash Flow Stability",
      assessment.components
        .cashFlowStability,
    ],
    [
      "Account Stability",
      assessment.components
        .accountStability,
    ],
  ];

  return (
    <div className="mx-auto max-w-[1300px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />

          Application History
        </Link>

        <div className="flex flex-wrap gap-3">
  <Link
    to={`/applications/${id}/copilot`}
    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
  >
    <BrainCircuit size={16} />

    Open Copilot
  </Link>

  <Link
    to={`/applications/${id}/result`}
    className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white"
  >
    View Assessment Result

    <ArrowRight size={16} />
  </Link>
</div>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-xs text-slate-400">
              {
                application.applicationReference
              }
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {
                application.applicantName
              }
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Created{" "}
              {formatDate(
                application.createdAt,
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-slate-50 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Credit Intelligence
                Score
              </p>

              <p className="mt-1 text-3xl font-semibold text-slate-950">
                {
                  assessment.totalScore
                }

                <span className="text-base text-slate-400">
                  /100
                </span>
              </p>
            </div>

            <RiskBadge
              riskLevel={
                assessment.riskLevel
              }
              large
            />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <DetailsCard
          icon={UserRound}
          title="Applicant & Application"
        >
          <DetailsGrid>
            <Detail
              label="Applicant"
              value={
                application.applicantName
              }
            />

            <Detail
              label="Email"
              value={
                application.email ||
                "Not supplied"
              }
            />

            <Detail
              label="Employment type"
              value={
                application.employmentType
              }
            />

            <Detail
              label="Employment duration"
              value={`${application.employmentMonths} months`}
            />

            <Detail
              label="Credit purpose"
              value={
                application.creditPurpose
              }
            />

            <Detail
              label="Account age"
              value={`${application.accountAgeMonths} months`}
            />
          </DetailsGrid>
        </DetailsCard>

        <DetailsCard
          icon={FileText}
          title="Financial Profile"
        >
          <DetailsGrid>
            <Detail
              label="Monthly income"
              value={formatCurrency(
                application.monthlyIncome,
              )}
            />

            <Detail
              label="Requested amount"
              value={formatCurrency(
                application.requestedAmount,
              )}
            />

            <Detail
              label="Existing monthly debt"
              value={formatCurrency(
                application.existingMonthlyDebt,
              )}
            />

            <Detail
              label="Average monthly balance"
              value={formatCurrency(
                application.averageMonthlyBalance,
              )}
            />

            <Detail
              label="Monthly credits"
              value={formatCurrency(
                application.monthlyCredits,
              )}
            />

            <Detail
              label="Monthly debits"
              value={formatCurrency(
                application.monthlyDebits,
              )}
            />

            <Detail
              label="Income regularity"
              value={
                application.incomeRegularity
              }
            />

            <Detail
              label="Utility payment rate"
              value={`${application.utilityPaymentRate}%`}
            />

            <Detail
              label="Missed payments"
              value={
                application.missedPayments
              }
            />
          </DetailsGrid>
        </DetailsCard>
      </div>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h3 className="font-semibold text-slate-950">
          Component Scores
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Deterministic score
          contribution by component
        </p>

        <div className="mt-6 space-y-5">
          {components.map(
            ([label, score]) => (
              <div key={label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {label}
                  </span>

                  <span className="text-sm font-semibold text-slate-950">
                    {score}/20
                  </span>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-900"
                    style={{
                      width:
                        `${(score / 20) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SignalPanel
          title="Positive Signals"
          icon={CheckCircle2}
          items={
            assessment.positiveFactors
          }
          positive
        />

        <SignalPanel
          title="Attention Signals"
          icon={AlertTriangle}
          items={
            assessment.riskFactors
          }
        />
      </div>

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
    </div>
  );
}

function DetailsCard({
  icon: Icon,
  title,
  children,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Icon size={19} />
        </div>

        <h3 className="font-semibold text-slate-950">
          {title}
        </h3>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function DetailsGrid({
  children,
}) {
  return (
    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {children}
    </div>
  );
}

function Detail({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

function SignalPanel({
  title,
  icon: Icon,
  items,
  positive = false,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <Icon
          size={19}
          className={
            positive
              ? "text-emerald-600"
              : "text-amber-600"
          }
        />

        <h3 className="font-semibold text-slate-950">
          {title}
        </h3>
      </div>

      <div className="mt-5 space-y-3">
        {items?.length ? (
          items.map(
            (item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"
              >
                {item}
              </div>
            ),
          )
        ) : (
          <p className="text-sm text-slate-400">
            No signals in this
            category.
          </p>
        )}
      </div>
    </section>
  );
}

export default ApplicationDetailsPage;