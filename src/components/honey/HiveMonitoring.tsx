import { useEffect, useRef, useState } from "react";
import { Badge, Section, TechTag } from "./ui";

type Sensor = {
  key: string;
  label: string;
  unit: string;
  base: number;
  swing: number;
  decimals: number;
  format?: (v: number) => string;
};

const SENSORS: Sensor[] = [
  { key: "temp", label: "Temperature", unit: "°C", base: 34.2, swing: 0.6, decimals: 1 },
  { key: "hum", label: "Humidity", unit: "%", base: 68, swing: 3, decimals: 0 },
  { key: "weight", label: "Hive Weight", unit: "kg", base: 12.5, swing: 0.25, decimals: 2 },
  {
    key: "bees",
    label: "Bee Activity",
    unit: "",
    base: 82,
    swing: 9,
    decimals: 0,
    format: (v) => (v > 75 ? "High" : v > 55 ? "Medium" : "Low"),
  },
];

function seed(base: number, swing: number) {
  return Array.from({ length: 24 }, (_, i) => base + Math.sin(i / 2.4) * swing * 0.6);
}

function Spark({ data, base, swing }: { data: number[]; base: number; swing: number }) {
  const min = base - swing * 1.6;
  const max = base + swing * 1.6;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 100;
      return `${x.toFixed(2)},${Math.max(2, Math.min(98, y)).toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-16 w-full">
      <polyline
        points={`0,100 ${pts} 100,100`}
        fill="var(--primary)"
        opacity="0.14"
        stroke="none"
      />
      <polyline
        points={pts}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HIVES = [
  { id: "Hive 01", x: 32, y: 44, ok: true },
  { id: "Hive 02", x: 58, y: 30, ok: false },
  { id: "Hive 03", x: 47, y: 68, ok: true },
];

export function HiveMonitoring({ onSeen }: { onSeen: () => void }) {
  const [series, setSeries] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(SENSORS.map((s) => [s.key, seed(s.base, s.swing)])),
  );
  const [tick, setTick] = useState(0);
  const seenRef = useRef(false);

  useEffect(() => {
    if (!seenRef.current) {
      seenRef.current = true;
      onSeen();
    }
    const t = setInterval(() => {
      setSeries((prev) => {
        const next: Record<string, number[]> = {};
        for (const s of SENSORS) {
          const arr = prev[s.key] ?? seed(s.base, s.swing);
          const last = arr[arr.length - 1] ?? s.base;
          const drift = (s.base - last) * 0.25 + (Math.random() - 0.5) * s.swing;
          next[s.key] = [...arr.slice(1), last + drift];
        }
        return next;
      });
      setTick((t2) => t2 + 1);
    }, 1800);
    return () => clearInterval(t);
  }, [onSeen]);

  return (
    <Section
      id="dashboard"
      index={1}
      title="Live Hive Monitoring — ESP32 Powered"
      subtitle="Sensor telemetry streaming from apiaries in Jaipur, Rajasthan."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SENSORS.map((s) => {
          const arr = series[s.key] ?? seed(s.base, s.swing);
          const v = arr[arr.length - 1] ?? s.base;
          return (
            <div key={s.key} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </p>
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full text-success" />
              </div>
              <p className="mt-2 font-display text-3xl font-semibold text-foreground">
                {s.format ? s.format(v) : v.toFixed(s.decimals)}
                <span className="ml-1 text-base text-primary">{s.unit}</span>
              </p>
              <Spark data={arr} base={s.base} swing={s.swing} />
              <p className="text-[11px] text-muted-foreground">
                Updated {tick === 0 ? "just now" : `${(tick * 1.8).toFixed(0)}s of live stream`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="glass relative overflow-hidden rounded-2xl p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-semibold">Hive Locations · Jaipur, Rajasthan</p>
            <Badge tone="muted">GPS · 26.9124° N, 75.7873° E</Badge>
          </div>
          <div className="honeycomb-bg relative mt-3 h-56 overflow-hidden rounded-xl border border-border">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-40">
              <path d="M0 62 C 20 50, 34 74, 55 60 S 86 40, 100 52" stroke="var(--primary)" strokeWidth="0.5" fill="none" />
              <path d="M12 0 L20 100" stroke="var(--muted-foreground)" strokeWidth="0.3" fill="none" />
              <path d="M78 0 L64 100" stroke="var(--muted-foreground)" strokeWidth="0.3" fill="none" />
            </svg>
            {HIVES.map((h) => (
              <div
                key={h.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                <span
                  className={`pulse-dot mx-auto block h-3 w-3 rounded-full ${h.ok ? "bg-success text-success" : "bg-destructive text-destructive"}`}
                />
                <span className="mt-2 block rounded-md bg-background/80 px-2 py-0.5 text-[11px] font-semibold">
                  {h.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <p className="font-display text-sm font-semibold">Alerts</p>
          <div className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3">
            <p className="text-sm font-semibold text-destructive">⚠ Hive 02 — Humidity High</p>
            <p className="mt-1 text-xs text-muted-foreground">
              74% recorded, threshold 70%. Ventilation check advised.
            </p>
          </div>
          <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-sm font-semibold text-success">✓ Hive 01 — All Normal</p>
            <p className="mt-1 text-xs text-muted-foreground">Weight gain +0.4 kg today.</p>
          </div>
          <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-3">
            <p className="text-sm font-semibold text-success">✓ Hive 03 — All Normal</p>
            <p className="mt-1 text-xs text-muted-foreground">Bee activity high since 06:20.</p>
          </div>
        </div>
      </div>

      <TechTag label="IoT">
        ESP32 sensors monitor hive conditions in real time.
      </TechTag>
    </Section>
  );
}
