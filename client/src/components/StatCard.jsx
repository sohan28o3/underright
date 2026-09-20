function StatCard({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Icon size={19} />
          </div>
        )}
      </div>

      {description && (
        <p className="mt-4 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}
    </article>
  );
}

export default StatCard;