import { useState } from "react";
import type { HoneyState } from "@/lib/honey-state";
import { Badge, Button, Section, TechTag } from "./ui";

const CONTRACT = "0x89a4c3e77b210d6f9c4a1e8d5b3f0c72a6e4f1b2";
const TX = "0x123f8ba90c7e2d41a6b5c9082f7314de6a09b8c7d21e45f6a3b90c1d2e3f4abc";

const short = (s: string) => `${s.slice(0, 6)}...${s.slice(-4)}`;

export function BlockchainVerification({
  state,
  update,
}: {
  state: HoneyState;
  update: (p: Partial<HoneyState>) => void;
}) {
  const [copied, setCopied] = useState("");
  const [mining, setMining] = useState(false);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  };

  const commit = () => {
    if (!state.labPassed) return;
    setMining(true);
    setTimeout(() => {
      update({ blockchainVerified: true, txHash: TX });
      setMining(false);
    }, 900);
  };

  const blocks = [
    { n: 1, t: "IoT Telemetry", ok: true },
    { n: 2, t: "Batch Registered", ok: state.registered },
    { n: 3, t: "Lab Verified", ok: state.labPassed },
    { n: 4, t: "Blockchain Sync", ok: state.blockchainVerified },
  ];

  return (
    <Section
      id="blockchain"
      index={4}
      title="Blockchain Verification — Solidity + Ethereum"
      subtitle="Every checkpoint written as an immutable, publicly auditable record."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="glass rounded-2xl p-5 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-sm font-semibold">Transaction Record</p>
            {state.blockchainVerified ? (
              <Badge tone="success">● VERIFIED</Badge>
            ) : (
              <Badge tone="muted">● Pending lab approval</Badge>
            )}
          </div>

          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Batch ID" value={state.batchId ?? "—"} />
            <Row
              label="Status"
              value={state.blockchainVerified ? "VERIFIED" : "AWAITING WRITE"}
              tone={state.blockchainVerified ? "success" : "muted"}
            />
            <Row
              label="Smart Contract"
              value={short(CONTRACT)}
              onCopy={() => copy("contract", CONTRACT)}
              copied={copied === "contract"}
            />
            <Row
              label="Tx Hash"
              value={state.blockchainVerified ? short(TX) : "—"}
              onCopy={state.blockchainVerified ? () => copy("tx", TX) : undefined}
              copied={copied === "tx"}
            />
            <Row label="Network" value="Ethereum Sepolia · Block #7,412,908" />
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={commit} disabled={!state.labPassed || state.blockchainVerified}>
              {mining
                ? "Writing block…"
                : state.blockchainVerified
                  ? "Record Committed"
                  : "Commit Batch to Chain"}
            </Button>
            {!state.labPassed && (
              <span className="text-xs text-muted-foreground">
                Smart contract rejects untested batches.
              </span>
            )}
          </div>

          <p className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm text-muted-foreground">
            <span className="font-display font-semibold text-primary">Smart Contract Rules: </span>
            Automatically ensures that only tested and approved honey batches move further in the
            supply chain.
          </p>
        </div>

        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <p className="font-display text-sm font-semibold">Block Chaining</p>
          <div className="mt-4 space-y-2">
            {blocks.map((b, i) => (
              <div key={b.n}>
                <div
                  className={`rounded-xl border p-3 transition ${
                    b.ok
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-secondary/40 opacity-60"
                  }`}
                >
                  <p className="text-xs text-muted-foreground">Block 0{b.n}</p>
                  <p className="font-display text-sm font-semibold">{b.t}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    hash 0x{(b.n * 4721).toString(16)}…{(b.n * 913).toString(16)}
                  </p>
                </div>
                {i < blocks.length - 1 && (
                  <p className="py-1 text-center text-primary/70">⛓</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs font-semibold text-success">
            {state.blockchainVerified ? "● Blockchain Sync complete" : "○ Awaiting sync"}
          </p>
        </div>
      </div>

      <TechTag label="BLOCKCHAIN">
        Solidity and Ethereum securely store honey-batch records.
      </TechTag>
    </Section>
  );
}

function Row({
  label,
  value,
  onCopy,
  copied,
  tone,
}: {
  label: string;
  value: string;
  onCopy?: (() => void) | undefined;
  copied?: boolean | undefined;
  tone?: "success" | "muted" | undefined;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2">
        <span
          className={`font-mono text-sm ${
            tone === "success"
              ? "font-semibold text-success"
              : tone === "muted"
                ? "text-muted-foreground"
                : "text-foreground"
          }`}
        >
          {value}
        </span>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </dd>
    </div>
  );
}
