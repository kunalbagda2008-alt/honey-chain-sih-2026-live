import { Link } from "@tanstack/react-router";

const NAV = [
  { href: "#dashboard", label: "Live Dashboard" },
  { href: "#how-it-works", label: "How it Works" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg text-primary-foreground shadow-lg shadow-primary/25">
            🍯
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Honey<span className="text-primary">Chain</span>
          </span>
        </Link>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto text-sm md:order-none md:w-auto">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary sm:inline">
            Team Brain Hustlers · SIH 2026
          </span>
        </div>
      </div>
    </header>
  );
}

const IMPACT = [
  { t: "Smart Monitoring", d: "Beekeepers keep an eye on hive conditions 24×7." },
  { t: "Increase Income", d: "Traceable, verified honey sells for more." },
  { t: "Easy Certification", d: "Lab reports and records stored in one place." },
  { t: "Premium Price", d: "Proven purity unlocks premium market access." },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          {["PILOT", "VALIDATE", "SCALE"].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span className="rounded-full glass-amber px-4 py-1.5 font-display text-sm font-semibold text-primary">
                {s}
              </span>
              {i < 2 && <span className="text-primary/50">→</span>}
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-display text-xl font-semibold">
          Impact: Helps Beekeepers
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT.map((i) => (
            <div key={i.t} className="glass rounded-2xl p-4">
              <p className="font-display text-sm font-semibold text-primary">{i.t}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{i.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          Honey Chain — Blockchain Honey Traceability System · Team Brain Hustlers ·
          Smart India Hackathon 2026 · Prototype with simulated data.
        </p>
      </div>
    </footer>
  );
}
