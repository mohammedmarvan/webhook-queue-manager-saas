import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface HourlyChartProps {
  data: { hour: number; events: number; deliveries: number }[]
}

const chartConfig = {
  events: {
    label: "Events",
    color: "var(--color-events)",
  },
  deliveries: {
    label: "Deliveries",
    color: "var(--color-deliveries)",
  },
} satisfies ChartConfig

export function HourlyChart({ data }: HourlyChartProps) {
  // Convert hour (0–23) to 12h label like "1 AM"
  const formattedData = data.map((d) => ({
    ...d,
    label:
      d.hour === 0
        ? "12 AM"
        : d.hour < 12
        ? `${d.hour} AM`
        : d.hour === 12
        ? "12 PM"
        : `${d.hour - 12} PM`,
  }))

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Events vs Deliveries</CardTitle>
        <CardDescription>Last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillDeliveries" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-deliveries)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-deliveries)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
            />
            <YAxis domain={[0, (dataMax: number) => dataMax + 100]} hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(label) => `${label}`}
                />
              }
            />
            <Area
              dataKey="events"
              type="natural"
              fill="url(#fillEvents)"
              stroke="var(--color-events)"
              strokeWidth={2}
            />
            <Area
              dataKey="deliveries"
              type="natural"
              fill="url(#fillDeliveries)"
              stroke="var(--color-deliveries)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
