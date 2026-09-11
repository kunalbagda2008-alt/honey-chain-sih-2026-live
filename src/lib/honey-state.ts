import { useCallback, useEffect, useState } from "react";

export const BATCH_ID = "HNY-JPR-001";

export type HoneyState = {
  batchId: string | null;
  beekeeper: string;
  hiveId: string;
  geo: string;
  harvestDate: string;
  packagingId: string;
  registered: boolean;
  labPassed: boolean;
  sugarTest: string;
  hmf: string;
  certificate: string;
  blockchainVerified: boolean;
  txHash: string | null;
  qrGenerated: boolean;
};

export const initialState: HoneyState = {
  batchId: null,
  beekeeper: "",
  hiveId: "",
  geo: "",
  harvestDate: "",
  packagingId: "",
  registered: false,
  labPassed: false,
  sugarTest: "Authentic",
  hmf: "",
  certificate: "",
  blockchainVerified: false,
  txHash: null,
  qrGenerated: false,
};

const KEY = "honeychain.state.v1";

export function loadState(): HoneyState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as Partial<HoneyState>) };
  } catch {
    return initialState;
  }
}

/** Shared, localStorage-backed state passed between the five modules. */
export function useHoneyState() {
  const [state, setState] = useState<HoneyState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<HoneyState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  return { state, update, reset, hydrated };
}

export const STEPS = [
  "Collect Data",
  "Store & Analyse",
  "Test Honey",
  "Verify on Blockchain",
  "Generate QR",
  "Customer Checks",
] as const;

export function completedSteps(s: HoneyState, monitoringSeen: boolean) {
  let n = 0;
  if (monitoringSeen) n = 1;
  if (s.registered) n = 2;
  if (s.labPassed) n = 3;
  if (s.blockchainVerified) n = 4;
  if (s.qrGenerated) n = 5;
  if (s.qrGenerated && s.blockchainVerified && s.labPassed && s.registered) n = Math.max(n, 5);
  return n;
}
