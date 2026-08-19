"use client";

import dynamic from "next/dynamic";

// recharts es una dependencia pesada (d3-shape, d3-scale, etc.). Al envolver el
// import dinámico en este Client Component, Next.js puede sacarlo del bundle
// principal del dashboard y cargarlo solo en el navegador (ssr: false), en vez
// de incluirlo siempre — ver "Skipping SSR" en el doc de lazy-loading de Next.
export const StockByCategoryChart = dynamic(
  () => import("./stock-by-category-chart").then((mod) => mod.StockByCategoryChart),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />,
  }
);
