import {
  useEffect,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";

import {
  AlertTriangle,
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../services/api";

import RiskBadge from "../components/RiskBadge";

import {
  formatCurrency,
} from "../utils/formatters";

const suggestedQuestions = [
  "Why was this applicant classified at this risk level?",
  "What are the strongest positive indicators?",
  "What should an underwriter verify manually?",
  "How is the debt burden affecting the assessment?",
  "Summarize this application.",
];

function CopilotPage() {
  const { id } =
    useParams();

  const [applicationData, setApplicationData] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const messagesEndRef =
    useRef(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const [
          applicationResponse,
          chatResponse,
        ] = await Promise.all([
          api.get(
            `/applications/${id}`,
          ),

          api.get(
            `/applications/${id}/chat`,
          ),
        ]);

        setApplicationData(
          applicationResponse.data,
        );

        setMessages(
          chatResponse.data.messages,
        );
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            "Unable to load Underwriter Copilot.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  async function sendMessage(
    text = message,
  ) {
    const trimmed =
      text.trim();

    if (
      !trimmed ||
      sending
    ) {
      return;
    }

    setSending(true);
    setError("");
    setMessage("");

    try {
      const response =
        await api.post(
          `/applications/${id}/chat`,
          {
            message: trimmed,
          },
        );

      setMessages(
        (current) => [
          ...current,
          response.data.userMessage,
          response.data.assistantMessage,
        ],
      );
    } catch (requestError) {
      const data =
        requestError.response?.data;

      setError(
        data?.fallback
          ? `${data.message} ${data.fallback}`
          : data?.message ||
              "Unable to send the Copilot question.",
      );

      setMessage(trimmed);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(
    event,
  ) {
    event.preventDefault();

    sendMessage();
  }

  function handleKeyDown(
    event,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-slate-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading Underwriter
            Copilot...
          </p>
        </div>
      </div>
    );
  }

  if (
    error &&
    !applicationData
  ) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertTriangle className="mx-auto text-red-500" />

        <p className="mt-4 text-sm text-red-700">
          {error}
        </p>
      </div>
    );
  }

  const {
    application,
    assessment,
  } = applicationData;

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to={`/applications/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />

          Application Details
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-800">
          <ShieldCheck size={14} />

          Score is read-only
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[330px_1fr]">
        <aside className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="bg-slate-950 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                  <BrainCircuit
                    size={21}
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold tracking-[0.14em] text-cyan-300">
                    UNDER RIGHT
                  </p>

                  <h2 className="mt-1 font-semibold">
                    Underwriter Copilot
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Gemini can explain the
                supplied assessment but
                cannot alter the score,
                risk level, or make the
                lending decision.
              </p>
            </div>

            <div className="p-6">
              <p className="font-mono text-xs text-slate-400">
                {
                  application.applicationReference
                }
              </p>

              <h3 className="mt-2 text-xl font-semibold text-slate-950">
                {
                  application.applicantName
                }
              </h3>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Score
                  </p>

                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {
                      assessment.totalScore
                    }

                    <span className="text-sm text-slate-400">
                      /100
                    </span>
                  </p>
                </div>

                <RiskBadge
                  riskLevel={
                    assessment.riskLevel
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-950">
              Application context
            </h3>

            <div className="mt-5 space-y-4">
              <ContextItem
                label="Employment"
                value={
                  application.employmentType
                }
              />

              <ContextItem
                label="Monthly income"
                value={formatCurrency(
                  application.monthlyIncome,
                )}
              />

              <ContextItem
                label="Requested amount"
                value={formatCurrency(
                  application.requestedAmount,
                )}
              />

              <ContextItem
                label="Monthly debt"
                value={formatCurrency(
                  application.existingMonthlyDebt,
                )}
              />

              <ContextItem
                label="Income regularity"
                value={
                  application.incomeRegularity
                }
              />

              <ContextItem
                label="Missed payments"
                value={
                  application.missedPayments
                }
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-950">
              Component scores
            </h3>

            <div className="mt-5 space-y-4">
              <MiniScore
                label="Income Stability"
                score={
                  assessment.components
                    .incomeStability
                }
              />

              <MiniScore
                label="Debt Capacity"
                score={
                  assessment.components
                    .debtCapacity
                }
              />

              <MiniScore
                label="Payment Behaviour"
                score={
                  assessment.components
                    .paymentBehaviour
                }
              />

              <MiniScore
                label="Cash Flow"
                score={
                  assessment.components
                    .cashFlowStability
                }
              />

              <MiniScore
                label="Account Stability"
                score={
                  assessment.components
                    .accountStability
                }
              />
            </div>
          </section>
        </aside>

        <section className="flex min-h-[720px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-cyan-300">
                <Sparkles
                  size={18}
                />
              </div>

              <div>
                <h2 className="font-semibold text-slate-950">
                  Ask about this
                  assessment
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  Answers use only this
                  application's supplied
                  financial data and
                  deterministic
                  assessment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-5 sm:p-6">
            {messages.length ===
              0 && (
              <WelcomeState
                onQuestion={
                  sendMessage
                }
                disabled={sending}
              />
            )}

            <div className="space-y-5">
              {messages.map(
                (chatMessage) => (
                  <ChatBubble
                    key={
                      chatMessage.id
                    }
                    message={
                      chatMessage
                    }
                  />
                ),
              )}

              {sending && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-cyan-300">
                    <BrainCircuit
                      size={16}
                    />
                  </div>

                  <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />

                      Copilot is reviewing
                      the supplied
                      assessment...
                    </div>
                  </div>
                </div>
              )}

              <div
                ref={
                  messagesEndRef
                }
              />
            </div>
          </div>

          {error && (
            <div className="mx-5 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800 sm:mx-6">
              {error}
            </div>
          )}

          <div className="border-t border-slate-100 bg-white p-5 sm:p-6">
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {suggestedQuestions.map(
                (question) => (
                  <button
                    key={
                      question
                    }
                    type="button"
                    disabled={
                      sending
                    }
                    onClick={() =>
                      sendMessage(
                        question,
                      )
                    }
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    {question}
                  </button>
                ),
              )}
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="flex items-end gap-3"
            >
              <textarea
                value={message}
                onChange={(
                  event,
                ) => {
                  setMessage(
                    event.target
                      .value,
                  );

                  setError("");
                }}
                onKeyDown={
                  handleKeyDown
                }
                rows="2"
                maxLength="1200"
                placeholder="Ask why the applicant received this risk classification..."
                className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />

              <button
                type="submit"
                disabled={
                  sending ||
                  !message.trim()
                }
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Send
                    size={18}
                  />
                )}
              </button>
            </form>

            <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">
              Copilot provides
              explanatory decision
              support only. It does not
              approve or reject credit.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function WelcomeState({
  onQuestion,
  disabled,
}) {
  return (
    <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
        <BrainCircuit
          size={23}
        />
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
        Explore the assessment
      </h3>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        Ask the Copilot to explain
        factors already contained in
        this application. It cannot
        change the score or make the
        final lending decision.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {suggestedQuestions
          .slice(0, 4)
          .map(
            (question) => (
              <button
                key={
                  question
                }
                type="button"
                disabled={
                  disabled
                }
                onClick={() =>
                  onQuestion(
                    question,
                  )
                }
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm font-medium leading-6 text-slate-700 transition hover:border-slate-300 hover:bg-white disabled:opacity-50"
              >
                {question}
              </button>
            ),
          )}
      </div>
    </div>
  );
}

function ChatBubble({
  message,
}) {
  const isUser =
    message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-slate-950 px-4 py-3 text-sm leading-6 text-white">
          {message.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-cyan-300">
        <BrainCircuit
          size={16}
        />
      </div>

      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm">
  <ReactMarkdown
    components={{
      p: ({ children }) => (
        <p className="mb-3 last:mb-0">
          {children}
        </p>
      ),

      strong: ({ children }) => (
        <strong className="font-semibold text-slate-950">
          {children}
        </strong>
      ),

      ul: ({ children }) => (
        <ul className="mb-3 ml-5 list-disc space-y-1.5">
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol className="mb-3 ml-5 list-decimal space-y-1.5">
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li>{children}</li>
      ),

      h3: ({ children }) => (
        <h3 className="mb-2 mt-4 font-semibold text-slate-950 first:mt-0">
          {children}
        </h3>
      ),
    }}
  >
    {message.message}
  </ReactMarkdown>
</div>
    </div>
  );
}

function ContextItem({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-700">
        {value}
      </span>
    </div>
  );
}

function MiniScore({
  label,
  score,
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          {label}
        </span>

        <span className="text-xs font-semibold text-slate-800">
          {score}/20
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900"
          style={{
            width:
              `${(score / 20) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

export default CopilotPage;