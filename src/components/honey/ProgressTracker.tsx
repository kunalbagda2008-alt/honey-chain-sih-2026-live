import { STEPS } from "@/lib/honey-state";

export function ProgressTracker({ completed }: { completed: number }) {
  const pct = (completed / STEPS.length) * 100;
  return (
    <div id="how-it-works" className="glass scroll-mt-28 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-sm font-semibold">
          Methodology / Process — end-to-end traceability
        </p>
        <span className="text-xs font-semibold text-primary">
          {completed} / {STEPS.length} steps complete
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {STEPS.map((s, i) => {
          const done = i < completed;
          const active = i === completed;
          return (
            <li
              key={s}
              className={`rounded-xl border px-3 py-2.5 text-center transition ${
                done
                  ? "border-primary/45 bg-primary/12 text-foreground"
                  : active
                    ? "border-primary/30 bg-secondary/60 text-foreground"
                    : "border-border bg-secondary/30 text-muted-foreground"
              }`}
            >
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Step {i + 1}
              </p>
              <p className="mt-0.5 font-display text-sm font-semibold">
                {done ? "✓ " : ""}
                {s}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
