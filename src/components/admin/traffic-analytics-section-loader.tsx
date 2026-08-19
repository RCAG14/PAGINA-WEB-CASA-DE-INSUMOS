"use client";

import dynamic from "next/dynamic";
import { Panel, PanelHeader } from "@/components/admin/panel";

// Mismo motivo que stock-by-category-chart-loader: mantiene recharts fuera del
// bundle inicial del dashboard, cargándolo solo en el cliente cuando se pinta
// esta sección.
export const TrafficAnalyticsSection = dynamic(
  () => import("./traffic-analytics-section").then((mod) => mod.TrafficAnalyticsSection),
  {
    ssr: false,
    loading: () => (
      <Panel>
        <PanelHeader label="Tráfico web por negocio — últimos 30 días" />
        <div className="p-4">
          <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </Panel>
    ),
  }
);
