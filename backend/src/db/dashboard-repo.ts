import { error } from "console";
import { prisma } from "../config/db"

const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getDashboardData() {
  const now = new Date()
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Run everything in parallel
  const [
    eventsLast24h,
    sourcesCount,
    destinationsCount,
    deliveriesLast24h,
    eventsByHour,
    deliveriesByHour,
  ] = await Promise.all([
    prisma.event.count({
      where: {
        receivedAt: { gte: since24h },
      },
    }),
    prisma.source.count(),
    prisma.destination.count(),
    prisma.delivery.count({
      where: {
        deliveredAt: { gte: since24h },
      },
    }),
    prisma.$queryRawUnsafe<{ hour: string; count: number }[]>(`
        SELECT 
            TO_CHAR(("receivedAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata'), 'HH24') AS hour,
            COUNT(*) AS count
        FROM "Event"
        WHERE "receivedAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY hour
        ORDER BY hour
    `),
    prisma.$queryRawUnsafe<{ hour: string; count: number }[]>(`
        SELECT 
            TO_CHAR(("deliveredAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata'), 'HH24') AS hour,
            COUNT(*) AS count
        FROM "Delivery"
        WHERE "deliveredAt" >= NOW() - INTERVAL '24 hours'
        GROUP BY hour
        ORDER BY hour
    `),
  ])

  // Transform groupBy results into 0–23 hour buckets
  const initBuckets: {
    hour: number;
    events: number;
    deliveries: number;
  }[] = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    events: 0,
    deliveries: 0,
  }))

    // Fill events
    eventsByHour.forEach((row) => {
        const hour = parseInt(row.hour)
        if (initBuckets[hour]) {
            initBuckets[hour].events = Number(row.count)
        }
    })

    // Fill deliveries
    deliveriesByHour.forEach((row) => {
        const hour = parseInt(row.hour)
        if (initBuckets[hour]) {
            initBuckets[hour].deliveries = Number(row.count)
        }
    })

  return {
    counts: {
      eventsLast24h,
      sourcesCount,
      destinationsCount,
      deliveriesLast24h,
    },
    hourly: initBuckets,
  }
}
