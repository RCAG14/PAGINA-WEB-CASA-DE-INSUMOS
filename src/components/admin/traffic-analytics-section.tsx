"use client";

import { Clock } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Panel, PanelHeader } from "@/components/admin/panel";
import type { PuntoTrafico } from "@/lib/data/metricas";

const chartConfig = {
  visitas: {
    label: "Visitas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const fechaFormatter = new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "2-digit" });

function formatFecha(fecha: string) {
  return fechaFormatter.format(new Date(`${fecha}T00:00:00Z`));
}

function TrafficChart({ data }: { data: PuntoTrafico[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
        <defs>
          <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-visitas)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--color-visitas)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
        <XAxis
          dataKey="fecha"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="font-mono-technical"
          fontSize={10}
          tickFormatter={formatFecha}
          interval="preserveStartEnd"
        />
        <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} allowDecimals={false} />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={(value) => formatFecha(String(value))} />}
        />
        <Area
          dataKey="visitas"
          type="monotone"
          fill="url(#trafficGradient)"
          stroke="var(--color-visitas)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

function ProximamenteCard({ nombre }: { nombre: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 text-center">
      <Clock className="size-5 text-muted-foreground" strokeWidth={1.5} />
      <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
        {nombre}
      </p>
      <span className="rounded-full border border-accent bg-accent/15 px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary">
        Próximamente
      </span>
    </div>
  );
}

function ProximamenteBadge() {
  return (
    <span className="rounded-full border border-border bg-muted px-1 py-0 font-mono-technical text-[8px] uppercase tracking-wider text-muted-foreground">
      Pronto
    </span>
  );
}

export function TrafficAnalyticsSection({
  dataCajas,
  dataWebdev,
}: {
  dataCajas: PuntoTrafico[];
  dataWebdev: PuntoTrafico[];
}) {
  return (
    <Panel>
      <PanelHeader label="Tráfico web por negocio — últimos 30 días" />

      <div className="p-4">
        <Tabs defaultValue="cajas">
          <TabsList>
            <TabsTrigger value="cajas">Cajas</TabsTrigger>
            <TabsTrigger value="webdev">Páginas Web</TabsTrigger>
            <TabsTrigger value="negocio3" className="gap-1.5">
              Negocio 3
              <ProximamenteBadge />
            </TabsTrigger>
            <TabsTrigger value="negocio4" className="gap-1.5">
              Negocio 4
              <ProximamenteBadge />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cajas" className="mt-4">
            <TrafficChart data={dataCajas} />
          </TabsContent>
          <TabsContent value="webdev" className="mt-4">
            <TrafficChart data={dataWebdev} />
          </TabsContent>
          <TabsContent value="negocio3" className="mt-4">
            <ProximamenteCard nombre="Negocio 3" />
          </TabsContent>
          <TabsContent value="negocio4" className="mt-4">
            <ProximamenteCard nombre="Negocio 4" />
          </TabsContent>
        </Tabs>
      </div>
    </Panel>
  );
}
