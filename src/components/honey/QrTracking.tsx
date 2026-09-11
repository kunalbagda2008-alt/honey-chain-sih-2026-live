import { useEffect, useState } from "react";
import type { HoneyState } from "@/lib/honey-state";
import { Badge, Button, Section, TechTag } from "./ui";
import { ConsumerReport, DEMO_CONSUMER, type ConsumerData } from "./ConsumerReport";

export function QrTracking({
  state,
  update,
}: {
  state: HoneyState;
  update: (p: Partial<HoneyState>) => void;
}) {
  const [qr, setQr] = useState<string>("");
  const [showConsumer, setShowConsumer] = useState(false);

  const batchId = state.batchId ?? DEMO_CONSUMER.batchId;
  const verifyUrl = `/verify?batch=${batchId}`;

  useEffect(() => {
    let alive = true;
    void (async () => {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(verifyUrl, {
        width: 512,
        margin: 1,
        color: { dark: "#121212", light: "#FFC107" },
      });
      if (alive) setQr(url);
    })();
    return () => {
      alive = false;
    };
  }, [verifyUrl]);

  const data: ConsumerData = {
    batchId,
    beekeeper: state.beekeeper || DEMO_CONSUMER.beekeeper,
    origin: state.geo ? "Jaipur, Rajasthan" : DEMO_CONSUMER.origin,
    harvestDate: state.harvestDate
      ? new Date(state.harvestDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : DEMO_CONSUMER.harvestDate,
    hmf: state.hmf || DEMO_CONSUMER.hmf,
    sugarTest: `C3/C4 ${state.sugarTest || "Authentic"}`,
    verified: state.blockchainVerified,
    txHash: state.txHash ? `${state.txHash.slice(0, 8)}...${state.txHash.slice(-4)}` : null,
  };

  return (
    <Section
      id="qr"
      index={5}
      title="QR Based Tracking — Scan to Trust"
      subtitle="One scan on the jar opens the full verified history of the batch."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="glass flex flex-col items-center rounded-2xl p-6 text-center lg:col-span-2">
          <Badge tone="honey">Dynamic QR · {batchId}</Badge>
          <div className="mt-4 rounded-2xl bg-primary p-3">
            {qr ? (
              <img src={qr} alt={`QR code for honey batch ${batchId}`} className="h-48 w-48 rounded-lg" />
            ) : (
              <div className="h-48 w-48 animate-pulse rounded-lg bg-primary-foreground/20" />
            )}
          </div>
          <p className="mt-3 break-all text-xs text-muted-foreground">{verifyUrl}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href={qr || undefined} download={`${batchId}-qr.png`}>
              <Button variant="outline" type="button" disabled={!qr}>
                Download QR
              </Button>
            </a>
            <Button
              type="button"
              onClick={() => {
                setShowConsumer(true);
                update({ qrGenerated: true });
              }}
            >
              Scan Demo
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3">
          {showConsumer ? (
            <ConsumerReport data={data} />
          ) : (
            <div className="glass flex h-full min-h-64 flex-col items-center justify-center rounded-2xl p-8 text-center">
              <span className="text-4xl">📱</span>
              <p className="mt-3 font-display text-lg font-semibold">
                Scan the code to open the consumer page
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Press <strong>Scan Demo</strong> to simulate a customer scanning the jar in a shop.
              </p>
            </div>
          )}
        </div>
      </div>

      <TechTag label="QR + WEB">
        Dynamic QR codes link each jar to its on-chain batch record — no app install needed.
      </TechTag>
    </Section>
  );
}
