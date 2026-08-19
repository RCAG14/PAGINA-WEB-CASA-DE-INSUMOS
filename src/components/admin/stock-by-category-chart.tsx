"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  stock: {
    label: "Unidades en stock",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StockByCategoryChart({
  data,
}: {
  data: { categoria: string; stock: number }[];
}) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
        <defs>
          <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--color-stock)" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
        <XAxis
          dataKey="categoria"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="font-mono-technical"
          fontSize={10}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={50}
        />
        <YAxis tickLine={false} axisLine={false} fontSize={10} width={30} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="stock" fill="url(#stockGradient)" radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ChartContainer>
  );
}
