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
        <CartesianGrid vertical={false} stroke="var(--border)" />
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
        <Bar dataKey="stock" fill="var(--color-stock)" radius={[2, 2, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ChartContainer>
  );
}
