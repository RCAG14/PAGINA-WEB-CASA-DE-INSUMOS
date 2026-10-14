"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { formatPrice, formatUsd } from "@/lib/format";
import { MONEDA_COOKIE, type Moneda } from "@/lib/moneda/constants";

interface MonedaContextValue {
  moneda: Moneda;
  tipoCambio: number;
  setMoneda: (moneda: Moneda) => void;
  /** Formatea un monto cargado en dólares en la moneda elegida por el visitante. */
  formatMonto: (usd: number) => string;
}

const MonedaContext = createContext<MonedaContextValue | null>(null);

export function MonedaProvider({
  initialMoneda,
  tipoCambio,
  children,
}: {
  initialMoneda: Moneda;
  tipoCambio: number;
  children: ReactNode;
}) {
  const [moneda, setMonedaState] = useState<Moneda>(initialMoneda);

  // Sin router.refresh(): los precios se pintan en el cliente con este
  // contexto; la cookie solo hace que la próxima visita llegue igual desde el servidor.
  function setMoneda(next: Moneda) {
    setMonedaState(next);
    document.cookie = `${MONEDA_COOKIE}=${next}; path=/; max-age=31536000`;
  }

  function formatMonto(usd: number) {
    return moneda === "BOB" ? formatPrice(usd * tipoCambio) : formatUsd(usd);
  }

  return (
    <MonedaContext.Provider value={{ moneda, tipoCambio, setMoneda, formatMonto }}>
      {children}
    </MonedaContext.Provider>
  );
}

export function useMoneda() {
  const ctx = useContext(MonedaContext);
  if (!ctx) throw new Error("useMoneda debe usarse dentro de <MonedaProvider>.");
  return ctx;
}
