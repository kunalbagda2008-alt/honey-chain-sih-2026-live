import { useState } from "react";
import type { HoneyState } from "@/lib/honey-state";
import { Badge, Button, Field, Section, TechTag, inputClass } from "./ui";

export function LabTesting({
  state,
  update,
}: {
  state: HoneyState;
  update: (p: Partial<HoneyState>) => void;
}) {
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.batchId) {
      setError("Register a batch in Module 02 first.");
      return;
    }
    setError("");
    update({ labPassed: state.sugarTest === "Authentic" });
  };

  return (
    <Section
      id="lab"
      index={3}
      title="Lab Testing — Quality & Authenticity Check"
      subtitle="Accredited lab signs off on purity before the batch can move forward."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <form onSubmit={submit} className="glass rounded-2xl p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Lab Tester Login
              </p>
              <p className="font-display text-sm font-semibold">
                Dr. A. Meena · Jaipur Food Testing Lab
              </p>
            </div>
            <Badge tone="success">● Signed in</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Batch ID" hint="Auto-filled from Batch Registration">
              <input
                readOnly
                className={inputClass}
                value={state.batchId ?? "Awaiting registration…"}
              />
            </Field>
            <Field label="C3/C4 Sugar Test Result">
              <select
                className={inputClass}
                value={state.sugarTest}
                onChange={(e) => update({ sugarTest: e.target.value, labPassed: false })}
              >
                <option>Authentic</option>
                <option>Adulterated</option>
              </select>
            </Field>
            <Field label="HMF Level">
              <input
                required
                className={inputClass}
                placeholder="e.g. 15 mg/kg"
                value={state.hmf}
                onChange={(e) => update({ hmf: e.target.value, labPassed: false })}
              />
            </Field>
            <Field label="Upload Lab Certificate (PDF)">
              <input
                type="file"
                accept="application/pdf"
                className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary-foreground`}
                onChange={(e) => update({ certificate: e.target.files?.[0]?.name ?? "" })}
              />
            </Field>
          </div>

          {state.certificate && (
            <p className="mt-3 text-xs text-muted-foreground">📄 Attached: {state.certificate}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button type="submit">Verify &amp; Push to Blockchain</Button>
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>

          {state.labPassed && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-success/40 bg-success/10 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-success text-lg text-success-foreground">
                ✓
              </span>
              <div>
                <p className="font-display font-semibold text-success">Lab Test PASSED</p>
                <p className="text-xs text-muted-foreground">
                  C3/C4 Authentic · HMF {state.hmf || "15 mg/kg"} · queued for blockchain write.
                </p>
              </div>
            </div>
          )}
          {!state.labPassed && state.sugarTest === "Adulterated" && (
            <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              ✕ Adulteration detected — smart contract will block this batch.
            </div>
          )}
        </form>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <p className="font-display text-sm font-semibold">AI Analysis Snapshot</p>
          <div className="mt-4 space-y-3">
            {[
              { l: "Purity Confidence", v: 96 },
              { l: "Moisture Index", v: 71 },
              { l: "Pollen Match (Mustard)", v: 88 },
            ].map((m) => (
              <div key={m.l}>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{m.l}</span>
                  <span className="font-semibold text-primary">{m.v}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${m.v}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Model flags anomalies by comparing hive telemetry with lab chemistry across past batches.
          </p>
        </div>
      </div>

      <TechTag label="AI">
        Python &amp; TensorFlow analyse the collected data. Lab results (C3/C4 and HMF) are stored to
        check quality.
      </TechTag>
    </Section>
  );
}
