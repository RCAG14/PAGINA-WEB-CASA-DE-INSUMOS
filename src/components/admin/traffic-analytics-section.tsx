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
        <CartesianGrid vertical={false} stroke="var(--border)" />
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
          fill="var(--color-visitas)"
          fillOpacity={0.15}
          stroke="var(--color-visitas)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

function ProximamenteCard({ nombre }: { nombre: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 border border-dashed border-border bg-muted/30 text-center">
      <Clock className="size-5 text-muted-foreground" strokeWidth={1.5} />
      <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
        {nombre}
      </p>
      <span className="border border-accent bg-accent/15 px-2 py-0.5 font-mono-technical text-[10px] uppercase tracking-wider text-primary">
        Próximamente
      </span>
    </div>
  );
}

function ProximamenteBadge() {
  return (
    <span className="border border-border bg-muted px-1 py-0 font-mono-technical text-[8px] uppercase tracking-wider text-muted-foreground">
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
    <div className="border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono-technical text-[11px] uppercase tracking-wider text-muted-foreground">
          Tráfico web por negocio — últimos 30 días
        </p>
      </div>

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
  );
}
