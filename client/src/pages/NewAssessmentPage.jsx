import {
  ClipboardList,
} from "lucide-react";

function NewAssessmentPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <ClipboardList size={25} />
        </div>

        <h2 className="mt-5 text-2xl font-semibold text-slate-950">
          New Credit Assessment
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
          The complete underwriting form
          and submission workflow will be
          implemented.
        </p>
      </div>
    </div>
  );
}

export default NewAssessmentPage;