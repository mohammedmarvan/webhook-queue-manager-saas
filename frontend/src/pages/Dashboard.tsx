import { useEffect, useState } from "react"
import { getDashbaordData } from "@/api/dashboard"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageLoader } from "@/components/layout/PageLoader"
import { AppToast } from "@/components/layout/AppToast"
import { Activity, Database, Send, Package } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { HourlyChart } from "@/components/dashboard/HourlyChart"

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const res = await getDashbaordData()
        if (res.status) {
            setData(res.data);
            return;
        }else {
            AppToast.error(res.message || "Something went wrong")
        }
      } catch (err: any) {
        AppToast.error("Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      {/* Row 1: 4 cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 lg:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">Events (24h)</CardTitle>
            <CardAction>
                <Activity className="h-5 w-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.counts.eventsLast24h}</div>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">Sources</CardTitle>
            <CardAction>
                <Database className="h-5 w-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.counts.sourcesCount}</CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">Destinations</CardTitle>
            <CardAction>
                <Send className="h-5 w-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.counts.destinationsCount}</CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">Deliveries (24h)</CardTitle>
            <CardAction>
                <Package className="h-5 w-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.counts.deliveriesLast24h}</CardContent>
        </Card>
      </div>

      {/* Row 2: Graph */}
      <div className="px-4 lg:px-6">
        {data?.hourly && <HourlyChart data={data.hourly} />}
      </div>
    </div>
  )
}
