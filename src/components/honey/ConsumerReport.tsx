import { Badge } from "./ui";

export type ConsumerData = {
  batchId: string;
  beekeeper: string;
  origin: string;
  harvestDate: string;
  hmf: string;
  sugarTest: string;
  verified: boolean;
  txHash: string | null;
};

export const DEMO_CONSUMER: ConsumerData = {
  batchId: "HNY-JPR-001",
  beekeeper: "Ramesh Kumar",
  origin: "Jaipur, Rajasthan",
  harvestDate: "10 Sep 2026",
  hmf: "15 mg/kg",
  sugarTest: "C3/C4 Authentic",
  verified: true,
  txHash: "0x123f8b...4abc",
};

const JOURNEY = ["Hive", "Beekeeper", "Lab", "Processing", "QR", "You"];

export function ConsumerReport({ data }: { data: ConsumerData }) {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="glass-amber flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-primary">Consumer Verification</p>
          <h3 className="font-display text-xl font-semibold">Pure Natural Honey</h3>
        </div>
        <Badge tone={data.verified ? "success" : "danger"}>
          {data.verified ? "✓ Blockchain Verified" : "Not verified"}
        </Badge>
      </div>

      <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
        <dl className="space-y-3 text-sm">
          {[
            ["Product", "Pure Natural Honey"],
            ["Batch ID", data.batchId],
            ["Origin", data.origin],
            ["Beekeeper", data.beekeeper],
            ["Harvest Date", data.harvestDate],
            ["Lab Test", `${data.sugarTest}, HMF ${data.hmf} — PASSED`],
            ["Tx Hash", data.txHash ?? "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        <div>
          <p className="font-display text-sm font-semibold">Full Journey Map</p>
          <ol className="mt-4 space-y-3">
            {JOURNEY.map((j, i) => (
              <li key={j} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-medium">{j}</span>
                {i < JOURNEY.length - 1 && (
                  <span className="ml-auto text-xs text-muted-foreground">↓</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="border-t border-border/60 bg-primary/5 px-6 py-4 text-sm text-muted-foreground">
        <span className="font-display font-semibold text-primary">BUILDS CUSTOMER TRUST: </span>
        Customers can simply scan the QR code and check where the honey came from, how it was
        tested, and what happened to the batch.
      </p>
    </div>
  );
}
