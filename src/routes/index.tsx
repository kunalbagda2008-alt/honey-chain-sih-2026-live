import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Footer, Header } from "@/components/honey/Chrome";
import { ProgressTracker } from "@/components/honey/ProgressTracker";
import { HiveMonitoring } from "@/components/honey/HiveMonitoring";
import { BatchRegistration } from "@/components/honey/BatchRegistration";
import { LabTesting } from "@/components/honey/LabTesting";
import { BlockchainVerification } from "@/components/honey/BlockchainVerification";
import { QrTracking } from "@/components/honey/QrTracking";
import { Badge, Button } from "@/components/honey/ui";
import { completedSteps, useHoneyState } from "@/lib/honey-state";

const TITLE = "Honey Chain — Blockchain Honey Traceability System | SIH 2026";
const DESC =
  "Live hive monitoring, batch registration, lab testing, blockchain verification and QR tracking for honey — a working prototype by Team Brain Hustlers for SIH 2026.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});


function Index() {
  const { state, update, reset } = useHoneyState();
  const [monitoringSeen, setMonitoringSeen] = useState(false);
  const onSeen = useCallback(() => setMonitoringSeen(true), []);
  const completed = completedSteps(state, monitoringSeen);

  return (
    <div className="honeycomb-bg min-h-screen">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <section className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <Badge tone="honey">● Live Prototype · Smart India Hackathon 2026</Badge>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              <span className="text-honey-gradient">Honey Chain</span>
              <br />
              Blockchain Honey Traceability
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Our prototype shows live hive monitoring, batch registration, honey testing,
              blockchain verification and QR-based tracking in one connected system — from the hive
              in Jaipur to the jar in your hand.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#dashboard">
                <Button>Open Live Dashboard</Button>
              </a>
              <a href="#qr">
                <Button variant="outline">Scan a Batch</Button>
              </a>
              <Button variant="ghost" onClick={reset}>
                Reset Demo
              </Button>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <p className="font-display text-sm font-semibold">Current Batch in Flight</p>
            <p className="mt-2 font-display text-3xl font-bold text-primary">
              {state.batchId ?? "No batch yet"}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Hives online", "3 / 3"],
                ["Sensors streaming", "12"],
                ["Batches on chain", state.blockchainVerified ? "1" : "0"],
                ["Consumer scans", state.qrGenerated ? "1" : "0"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-secondary/40 p-3">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-display text-lg font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-10">
          <ProgressTracker completed={completed} />
        </div>

        <div className="mt-16 space-y-20">
          <HiveMonitoring onSeen={onSeen} />
          <BatchRegistration state={state} update={update} />
          <LabTesting state={state} update={update} />
          <BlockchainVerification state={state} update={update} />
          <QrTracking state={state} update={update} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
