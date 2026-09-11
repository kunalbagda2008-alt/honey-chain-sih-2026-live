import { useState } from "react";
import { BATCH_ID, type HoneyState } from "@/lib/honey-state";
import { Badge, Button, Field, Section, TechTag, inputClass } from "./ui";

export function BatchRegistration({
  state,
  update,
}: {
  state: HoneyState;
  update: (p: Partial<HoneyState>) => void;
}) {
  const [locating, setLocating] = useState(false);

  const captureGeo = () => {
    setLocating(true);
    setTimeout(() => {
      update({ geo: "26.9124° N, 75.7873° E — Jaipur, Rajasthan" });
      setLocating(false);
    }, 700);
  };

  const register = (e: React.FormEvent) => {
    e.preventDefault();
    update({ batchId: BATCH_ID, registered: true });
  };

  return (
    <Section
      id="register"
      index={2}
      title="Beekeeper — Batch Registration"
      subtitle="Harvest details captured in the field and pushed to the chain of custody."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <form onSubmit={register} className="glass rounded-2xl p-5 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Beekeeper Name">
              <input
                required
                className={inputClass}
                placeholder="Ramesh Kumar"
                value={state.beekeeper}
                onChange={(e) => update({ beekeeper: e.target.value })}
              />
            </Field>
            <Field label="Hive ID">
              <input
                required
                className={inputClass}
                placeholder="HIVE-02"
                value={state.hiveId}
                onChange={(e) => update({ hiveId: e.target.value })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Geo Location">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    required
                    readOnly
                    className={`${inputClass} flex-1`}
                    placeholder="Tap auto-capture"
                    value={state.geo}
                  />
                  <Button type="button" variant="outline" onClick={captureGeo}>
                    {locating ? "Locating…" : "📍 Auto-capture"}
                  </Button>
                </div>
              </Field>
            </div>
            <Field label="Harvest Date">
              <input
                required
                type="date"
                className={inputClass}
                value={state.harvestDate}
                onChange={(e) => update({ harvestDate: e.target.value })}
              />
            </Field>
            <Field label="Packaging ID">
              <input
                required
                className={inputClass}
                placeholder="PKG-2026-118"
                value={state.packagingId}
                onChange={(e) => update({ packagingId: e.target.value })}
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button type="submit">Register Batch</Button>
            {state.registered && (
              <Badge tone="success">✓ Batch {state.batchId} Registered</Badge>
            )}
          </div>

          {state.registered && (
            <div className="mt-4 rounded-xl border border-success/40 bg-success/10 p-3 text-sm">
              <p className="font-display font-semibold text-success">
                Batch {state.batchId} Registered
              </p>
              <p className="mt-1 text-muted-foreground">
                Batch ID saved locally and auto-filled into the Lab Testing module.
              </p>
            </div>
          )}
        </form>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <p className="font-display text-sm font-semibold">Chain of Custody Timeline</p>
          <ol className="mt-4 space-y-4">
            {[
              { t: "Beehive Harvest → Beekeeper App", d: "Raw honey collected & logged", done: state.registered },
              { t: "Lab Testing", d: "Purity & authenticity check", done: state.labPassed },
              { t: "Blockchain Record", d: "Immutable batch entry", done: state.blockchainVerified },
              { t: "QR Issued", d: "Consumer-facing proof", done: state.qrGenerated },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                      s.done
                        ? "bg-success text-success-foreground"
                        : "border border-border bg-secondary text-muted-foreground"
                    }`}
                  >
                    {s.done ? "✓" : i + 1}
                  </span>
                  {i < 3 && <span className="mt-1 h-8 w-px bg-border" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Step {i + 1} {s.done ? "Completed" : "Pending"}: {s.t}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <TechTag label="FRONTEND / BACKEND">
        React &amp; Next.js and Flutter on the front end, Node.js with Express.js on the back end.
      </TechTag>
    </Section>
  );
}
