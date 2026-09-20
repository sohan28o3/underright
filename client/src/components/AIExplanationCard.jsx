import {
  useState,
} from "react";

import ReactMarkdown from "react-markdown";

import {
  BrainCircuit,
  Info,
  Loader2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

import api from "../services/api";

function AIExplanationCard({
  applicationId,
  initialExplanation = null,
}) {
  const [
    explanation,
    setExplanation,
  ] = useState(
    initialExplanation,
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [fallback, setFallback] =
    useState("");

  async function handleGenerate(
  regenerate = false,
) {
  try {
    setLoading(true);
    setError("");
    setFallback("");

    const response =
      await api.post(
        `/applications/${applicationId}/explanation`,
        {
          regenerate,
        },
      );

    setExplanation(
      response.data.explanation,
    );
  } catch (requestError) {
    const data =
      requestError.response?.data;

    setError(
      data?.message ||
        "AI explanation is currently unavailable.",
    );

    setFallback(
      data?.fallback ||
        "The deterministic assessment remains available for human review.",
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="bg-slate-950 p-6 text-white sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
              <BrainCircuit
                size={21}
              />
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] text-cyan-300">
                GEMINI EXPLANATION
                LAYER
              </p>

              <h3 className="mt-1 font-semibold">
                AI-Generated
                Underwriter Summary
              </h3>
            </div>
          </div>

          {explanation && (
            <span className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-400">
              Score remains read-only
            </span>
          )}
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-400">
          Gemini explains the
          deterministic result using
          supplied financial factors.
          It cannot calculate, modify,
          approve or reject this
          assessment.
        </p>
      </div>

      <div className="p-6 sm:p-7">
        {explanation ? (
          <>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1 className="mb-3 mt-5 text-lg font-semibold text-slate-950 first:mt-0">
          {children}
        </h1>
      ),

      h2: ({ children }) => (
        <h2 className="mb-2 mt-5 text-base font-semibold text-slate-950 first:mt-0">
          {children}
        </h2>
      ),

      h3: ({ children }) => (
        <h3 className="mb-2 mt-4 font-semibold text-slate-900">
          {children}
        </h3>
      ),

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
        <ul className="mb-4 ml-5 list-disc space-y-2">
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol className="mb-4 ml-5 list-decimal space-y-2">
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li className="pl-1">
          {children}
        </li>
      ),
    }}
  >
    {explanation}
  </ReactMarkdown>
</div>

            <button
              type="button"
              onClick={
                handleGenerate
              }
              disabled={loading}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCcw
                    size={16}
                  />

                  Regenerate
                  Explanation
                </>
              )}
            </button>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <Sparkles
              size={21}
              className="text-slate-500"
            />

            <p className="mt-3 text-sm font-semibold text-slate-800">
              Generate an
              underwriter-oriented
              explanation
            </p>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
              The numerical score has
              already been calculated.
              Gemini will only explain
              the strongest positive
              signals, attention areas
              and items that may require
              human verification.
            </p>

            <button
              type="button"
              onClick={
                handleGenerate
              }
              disabled={loading}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  Generating...
                </>
              ) : (
                <>
                  <Sparkles
                    size={16}
                  />

                  Generate AI
                  Explanation
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              {error}
            </p>

            {fallback && (
              <p className="mt-2 text-xs leading-5 text-amber-800">
                {fallback}
              </p>
            )}
          </div>
        )}

        <div className="mt-5 flex gap-3 rounded-xl bg-cyan-50 p-4">
          <Info
            size={17}
            className="mt-0.5 shrink-0 text-cyan-700"
          />

          <p className="text-xs leading-5 text-cyan-900/80">
            Generative AI is not part
            of the scoring path. The
            Credit Intelligence Score
            and risk classification
            shown above were calculated
            before Gemini was called.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AIExplanationCard;