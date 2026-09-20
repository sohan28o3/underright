import {
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Landmark,
  Loader2,
  ReceiptText,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

const initialForm = {
  applicantName: "",
  email: "",
  employmentType: "Salaried",
  employmentMonths: "",
  creditPurpose: "Personal credit",

  monthlyIncome: "",
  requestedAmount: "",
  existingMonthlyDebt: "",
  averageMonthlyBalance: "",

  monthlyCredits: "",
  monthlyDebits: "",
  incomeRegularity: "High",

  utilityPaymentRate: "",
  missedPayments: "",
  accountAgeMonths: "",
};

function NewAssessmentPage() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [serverError, setServerError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const completionCount =
    useMemo(() => {
      const requiredFields = [
        "applicantName",
        "employmentType",
        "employmentMonths",
        "creditPurpose",
        "monthlyIncome",
        "requestedAmount",
        "existingMonthlyDebt",
        "averageMonthlyBalance",
        "monthlyCredits",
        "monthlyDebits",
        "incomeRegularity",
        "utilityPaymentRate",
        "missedPayments",
        "accountAgeMonths",
      ];

      return requiredFields.filter(
        (field) =>
          String(form[field]).trim() !==
          "",
      ).length;
    }, [form]);

  const completionPercent =
    Math.round(
      (completionCount / 14) * 100,
    );

  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setServerError("");
  };

  const validate = () => {
    const nextErrors = {};

    if (
      form.applicantName.trim()
        .length < 2
    ) {
      nextErrors.applicantName =
        "Enter the applicant name.";
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email,
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    const numericChecks = [
      [
        "employmentMonths",
        "Employment duration",
        0,
      ],
      [
        "monthlyIncome",
        "Monthly income",
        0.01,
      ],
      [
        "requestedAmount",
        "Requested amount",
        0.01,
      ],
      [
        "existingMonthlyDebt",
        "Existing monthly debt",
        0,
      ],
      [
        "averageMonthlyBalance",
        "Average monthly balance",
        0,
      ],
      [
        "monthlyCredits",
        "Monthly credits",
        0,
      ],
      [
        "monthlyDebits",
        "Monthly debits",
        0,
      ],
      [
        "utilityPaymentRate",
        "Utility payment rate",
        0,
      ],
      [
        "missedPayments",
        "Missed payments",
        0,
      ],
      [
        "accountAgeMonths",
        "Account age",
        0,
      ],
    ];

    numericChecks.forEach(
      ([field, label, minimum]) => {
        if (
          form[field] === "" ||
          Number.isNaN(
            Number(form[field]),
          )
        ) {
          nextErrors[field] =
            `${label} is required.`;
          return;
        }

        if (
          Number(form[field]) <
          minimum
        ) {
          nextErrors[field] =
            `${label} cannot be below ${minimum}.`;
        }
      },
    );

    const utilityRate = Number(
      form.utilityPaymentRate,
    );

    if (
      !Number.isNaN(utilityRate) &&
      (utilityRate < 0 ||
        utilityRate > 100)
    ) {
      nextErrors.utilityPaymentRate =
        "Utility payment rate must be between 0 and 100.";
    }

    const integerFields = [
      "employmentMonths",
      "missedPayments",
      "accountAgeMonths",
    ];

    integerFields.forEach(
      (field) => {
        if (
          form[field] !== "" &&
          !Number.isInteger(
            Number(form[field]),
          )
        ) {
          nextErrors[field] =
            "Enter a whole number.";
        }
      },
    );

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  };

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault();

    if (!validate()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const payload = {
        applicantName:
          form.applicantName.trim(),

        email:
          form.email.trim(),

        employmentType:
          form.employmentType,

        employmentMonths:
          Number(
            form.employmentMonths,
          ),

        creditPurpose:
          form.creditPurpose,

        monthlyIncome:
          Number(form.monthlyIncome),

        requestedAmount:
          Number(
            form.requestedAmount,
          ),

        existingMonthlyDebt:
          Number(
            form.existingMonthlyDebt,
          ),

        averageMonthlyBalance:
          Number(
            form.averageMonthlyBalance,
          ),

        monthlyCredits:
          Number(
            form.monthlyCredits,
          ),

        monthlyDebits:
          Number(
            form.monthlyDebits,
          ),

        incomeRegularity:
          form.incomeRegularity,

        utilityPaymentRate:
          Number(
            form.utilityPaymentRate,
          ),

        missedPayments:
          Number(
            form.missedPayments,
          ),

        accountAgeMonths:
          Number(
            form.accountAgeMonths,
          ),
      };

      const response =
        await api.post(
          "/applications",
          payload,
        );

      const applicationId =
        response.data.application.id;

      navigate(
        `/applications/${applicationId}/result`,
      );
    } catch (requestError) {
      const responseData =
        requestError.response?.data;

      if (responseData?.errors) {
        const fieldErrors = {};

        Object.entries(
          responseData.errors,
        ).forEach(
          ([field, messages]) => {
            fieldErrors[field] =
              Array.isArray(messages)
                ? messages[0]
                : messages;
          },
        );

        setErrors(fieldErrors);
      }

      setServerError(
        responseData?.message ||
          "Unable to create the assessment. Please confirm that the backend is running.",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDemoApplicant = () => {
    setForm({
      applicantName:
        "Demo Applicant",

      email:
        "demo@example.com",

      employmentType:
        "Salaried",

      employmentMonths: "24",

      creditPurpose:
        "Personal credit",

      monthlyIncome: "60000",

      requestedAmount:
        "120000",

      existingMonthlyDebt:
        "10000",

      averageMonthlyBalance:
        "28000",

      monthlyCredits: "65000",

      monthlyDebits: "42000",

      incomeRegularity: "High",

      utilityPaymentRate: "96",

      missedPayments: "1",

      accountAgeMonths: "30",
    });

    setErrors({});
    setServerError("");
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            <ShieldCheck
              size={14}
            />

            Prototype configurable rules
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            New Credit Assessment
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Capture structured
            financial signals and run
            the transparent UnderRight
            scoring engine.
          </p>
        </div>

        <button
          type="button"
          onClick={
            loadDemoApplicant
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <CheckCircle2
            size={17}
          />

          Load demo applicant
        </button>
      </div>

      {serverError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Assessment input
              completion
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Optional email does not
              affect the score.
            </p>
          </div>

          <span className="text-sm font-semibold text-slate-800">
            {completionPercent}%
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-slate-900 transition-all duration-300"
            style={{
              width:
                `${completionPercent}%`,
            }}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <FormSection
          icon={UserRound}
          number="01"
          title="Applicant Information"
          description="Identification fields support workflow only and are excluded from scoring."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Applicant name"
              name="applicantName"
              value={
                form.applicantName
              }
              onChange={
                handleChange
              }
              error={
                errors.applicantName
              }
              placeholder="Demo Applicant"
              required
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={
                handleChange
              }
              error={errors.email}
              placeholder="applicant@example.com"
              optional
            />

            <SelectField
              label="Employment type"
              name="employmentType"
              value={
                form.employmentType
              }
              onChange={
                handleChange
              }
              options={[
                "Salaried",
                "Self-employed",
                "Contract",
                "Freelance",
                "Other",
              ]}
            />

            <InputField
              label="Employment duration"
              suffix="months"
              name="employmentMonths"
              type="number"
              min="0"
              step="1"
              value={
                form.employmentMonths
              }
              onChange={
                handleChange
              }
              error={
                errors.employmentMonths
              }
              placeholder="24"
              required
            />

            <div className="md:col-span-2">
              <SelectField
                label="Credit purpose"
                name="creditPurpose"
                value={
                  form.creditPurpose
                }
                onChange={
                  handleChange
                }
                options={[
                  "Personal credit",
                  "Vehicle purchase",
                  "Home improvement",
                  "Education",
                  "Business expenses",
                  "Medical expenses",
                  "Other",
                ]}
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={Banknote}
          number="02"
          title="Financial Information"
          description="Core affordability and liquidity indicators used by the prototype scoring rules."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <MoneyField
              label="Monthly income"
              name="monthlyIncome"
              value={
                form.monthlyIncome
              }
              onChange={
                handleChange
              }
              error={
                errors.monthlyIncome
              }
              placeholder="60000"
            />

            <MoneyField
              label="Requested credit amount"
              name="requestedAmount"
              value={
                form.requestedAmount
              }
              onChange={
                handleChange
              }
              error={
                errors.requestedAmount
              }
              placeholder="120000"
            />

            <MoneyField
              label="Existing monthly debt obligations"
              name="existingMonthlyDebt"
              value={
                form.existingMonthlyDebt
              }
              onChange={
                handleChange
              }
              error={
                errors.existingMonthlyDebt
              }
              placeholder="10000"
            />

            <MoneyField
              label="Average monthly account balance"
              name="averageMonthlyBalance"
              value={
                form.averageMonthlyBalance
              }
              onChange={
                handleChange
              }
              error={
                errors.averageMonthlyBalance
              }
              placeholder="28000"
            />
          </div>
        </FormSection>

        <FormSection
          icon={WalletCards}
          number="03"
          title="Cash Flow"
          description="Monthly account movement helps describe liquidity and cash-flow stability."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <MoneyField
              label="Monthly credits"
              name="monthlyCredits"
              value={
                form.monthlyCredits
              }
              onChange={
                handleChange
              }
              error={
                errors.monthlyCredits
              }
              placeholder="65000"
            />

            <MoneyField
              label="Monthly debits"
              name="monthlyDebits"
              value={
                form.monthlyDebits
              }
              onChange={
                handleChange
              }
              error={
                errors.monthlyDebits
              }
              placeholder="42000"
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Income regularity
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "High",
                  "Medium",
                  "Low",
                ].map(
                  (option) => (
                    <label
                      key={option}
                      className={[
                        "cursor-pointer rounded-xl border p-4 transition",
                        form.incomeRegularity ===
                        option
                          ? "border-slate-900 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="incomeRegularity"
                        value={option}
                        checked={
                          form.incomeRegularity ===
                          option
                        }
                        onChange={
                          handleChange
                        }
                        className="sr-only"
                      />

                      <p className="font-semibold">
                        {option}
                      </p>

                      <p
                        className={[
                          "mt-1 text-xs",
                          form.incomeRegularity ===
                          option
                            ? "text-slate-300"
                            : "text-slate-400",
                        ].join(
                          " ",
                        )}
                      >
                        {option ===
                          "High" &&
                          "Consistent recurring income"}

                        {option ===
                          "Medium" &&
                          "Some month-to-month variation"}

                        {option ===
                          "Low" &&
                          "Material income variation"}
                      </p>
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection
          icon={ReceiptText}
          number="04"
          title="Payment Behaviour & Account Stability"
          description="Alternative financial signals used only as transparent prototype indicators."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Utility payment rate"
              suffix="%"
              name="utilityPaymentRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={
                form.utilityPaymentRate
              }
              onChange={
                handleChange
              }
              error={
                errors.utilityPaymentRate
              }
              placeholder="96"
              required
            />

            <InputField
              label="Missed payments in last 12 months"
              name="missedPayments"
              type="number"
              min="0"
              step="1"
              value={
                form.missedPayments
              }
              onChange={
                handleChange
              }
              error={
                errors.missedPayments
              }
              placeholder="1"
              required
            />

            <InputField
              label="Bank / account age"
              suffix="months"
              name="accountAgeMonths"
              type="number"
              min="0"
              step="1"
              value={
                form.accountAgeMonths
              }
              onChange={
                handleChange
              }
              error={
                errors.accountAgeMonths
              }
              placeholder="30"
              required
            />
          </div>
        </FormSection>

        <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-2xl gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                <ShieldCheck
                  size={20}
                />
              </div>

              <div>
                <h3 className="font-semibold">
                  Transparent prototype
                  assessment
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Applicant name and
                  email are excluded from
                  scoring. No protected
                  demographic attributes
                  are collected. The
                  numerical score is
                  generated only by the
                  deterministic scoring
                  service.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Running assessment...
                </>
              ) : (
                <>
                  Run Credit Assessment

                  <ArrowRight
                    size={17}
                  />
                </>
              )}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

function FormSection({
  icon: Icon,
  number,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-6 sm:p-7">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
            <Icon size={20} />
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-slate-400">
              SECTION {number}
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-950">
              {title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        {children}
      </div>
    </section>
  );
}

function InputField({
  label,
  optional,
  suffix,
  error,
  ...props
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor={props.name}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>

        {optional && (
          <span className="text-[11px] text-slate-400">
            Optional
          </span>
        )}
      </div>

      <div className="relative">
        <input
          id={props.name}
          {...props}
          className={[
            "h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-300 focus:ring-4",
            suffix
              ? "pr-20"
              : "",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-50"
              : "border-slate-200 focus:border-slate-400 focus:ring-slate-100",
          ].join(" ")}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function MoneyField({
  label,
  error,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
          ₹
        </span>

        <input
          id={props.name}
          type="number"
          min="0"
          step="0.01"
          {...props}
          className={[
            "h-12 w-full rounded-xl border bg-white pl-9 pr-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-300 focus:ring-4",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-50"
              : "border-slate-200 focus:border-slate-400 focus:ring-slate-100",
          ].join(" ")}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  options,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <select
        id={props.name}
        {...props}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ),
        )}
      </select>
    </div>
  );
}

export default NewAssessmentPage;