import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Footer, Header } from "@/components/honey/Chrome";
import { ConsumerReport, DEMO_CONSUMER, type ConsumerData } from "@/components/honey/ConsumerReport";
import { Button } from "@/components/honey/ui";
import { loadState } from "@/lib/honey-state";

const TITLE = "Verify Your Honey Batch — Honey Chain";
const DESC =
  "Scan-to-trust consumer page: origin, beekeeper, harvest date, lab results and blockchain verification for your honey batch.";

export const Route = createFileRoute("/verify")({
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
  component: VerifyPage,
});

function VerifyPage() {
  const [data, setData] = useState<ConsumerData>(DEMO_CONSUMER);

  useEffect(() => {
    const s = loadState();
    if (!s.registered) return;
    setData({
      batchId: s.batchId ?? DEMO_CONSUMER.batchId,
      beekeeper: s.beekeeper || DEMO_CONSUMER.beekeeper,
      origin: DEMO_CONSUMER.origin,
      harvestDate: s.harvestDate
        ? new Date(s.harvestDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : DEMO_CONSUMER.harvestDate,
      hmf: s.hmf || DEMO_CONSUMER.hmf,
      sugarTest: `C3/C4 ${s.sugarTest || "Authentic"}`,
      verified: s.blockchainVerified,
      txHash: s.txHash ? `${s.txHash.slice(0, 8)}...${s.txHash.slice(-4)}` : DEMO_CONSUMER.txHash,
    });
  }, []);

  return (
    <div className="honeycomb-bg min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold">
          Verify Your <span className="text-honey-gradient">Honey Batch</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Batch {data.batchId} · verified against the Honey Chain smart contract.
        </p>
        <div className="mt-8">
          <ConsumerReport data={data} />
        </div>
        <div className="mt-6">
          <Link to="/">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
