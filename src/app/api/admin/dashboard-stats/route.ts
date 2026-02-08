import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { startOfMonth, subMonths, format, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. KPI: Total Revenue (Current Month)
        // Check if we use 'Transaction' table or sum 'Ticket' values. 
        // Based on previous files, Transaction seems to be the source of truth for finance.
        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        const endOfCurrentMonth = endOfMonth(now);

        const currentMonthRevenueAgg = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                type: 'INCOME', // Assuming 'INCOME' is the type for revenue
                date: {
                    gte: startOfCurrentMonth,
                    lte: endOfCurrentMonth
                }
            }
        });
        const currentMonthRevenue = currentMonthRevenueAgg._sum.amount || 0;

        // Previous Month for Trend Calculation
        const startOfLastMonth = startOfMonth(subMonths(now, 1));
        const endOfLastMonth = endOfMonth(subMonths(now, 1));
        const lastMonthRevenueAgg = await prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                type: 'INCOME',
                date: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth
                }
            }
        });
        const lastMonthRevenue = lastMonthRevenueAgg._sum.amount || 0;

        let revenueTrend = 0;
        if (lastMonthRevenue > 0) {
            revenueTrend = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else if (currentMonthRevenue > 0) {
            revenueTrend = 100;
        }


        // 2. KPI: Open Tickets
        const openTicketsCount = await prisma.ticket.count({
            where: {
                status: {
                    in: ['OPEN', 'IN_PROGRESS', 'SCHEDULED', 'QUOTED']
                }
            }
        });

        // 3. KPI: SLA at Risk (Simplified logic: Older than 3 days and still open)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const slaAtRiskCount = await prisma.ticket.count({
            where: {
                status: {
                    in: ['OPEN', 'IN_PROGRESS']
                },
                createdAt: {
                    lt: threeDaysAgo
                }
            }
        });

        // 4. KPI: NPS (Average Rating)
        const ratingsAgg = await prisma.ticket.aggregate({
            _avg: { rating: true },
            where: {
                rating: { not: null }
            }
        });
        // Scale 1-5 to NPS-like 0-100 or just show average * 20? 
        // NPS is usually -100 to 100 based on promoters/detractors.
        // Let's settle for simple "Satisfação" 0-5 for now, or assume 5 star = 100.
        // Let's map avg 5 -> 100, 4 -> 80, etc.
        const avgRating = ratingsAgg._avg.rating || 0;
        const npsScore = Math.round(avgRating * 20); // 5 * 20 = 100

        let npsLabel = "Neutro";
        if (npsScore >= 80) npsLabel = "Excelente";
        else if (npsScore >= 60) npsLabel = "Bom";
        else if (npsScore >= 40) npsLabel = "Regular";
        else npsLabel = "Ruim";


        // 5. Chart: Revenue Last 6 Months
        const revenueChartData = [];
        for (let i = 5; i >= 0; i--) {
            const d = subMonths(now, i);
            const start = startOfMonth(d);
            const end = endOfMonth(d);
            const monthName = format(d, "MMM", { locale: ptBR });

            const agg = await prisma.transaction.aggregate({
                _sum: { amount: true },
                where: {
                    type: 'INCOME',
                    date: { gte: start, lte: end }
                }
            });

            revenueChartData.push({
                name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                value: agg._sum.amount || 0
            });
        }

        // 6. Chart: Tickets by Type
        const ticketsByType = await prisma.ticket.groupBy({
            by: ['serviceType'],
            _count: {
                _all: true // Valid syntax for Prisma groupBy count
            }
        });

        const ticketTypeData = ticketsByType.map(t => ({
            name: t.serviceType,
            value: t._count._all
        }));

        // 7. Recent Tickets
        const recentTicketsRaw = await prisma.ticket.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } } // Fetch client name
            }
        });

        const recentTickets = recentTicketsRaw.map(t => {
            // Map status to simpler display/color if needed, or send raw
            return {
                id: t.id.slice(-6).toUpperCase(), // Short ID
                fullId: t.id,
                client: t.user?.name || t.user?.email || 'Desconhecido',
                cat: t.serviceType,
                status: t.status,
                // Helper for frontend colors can be done there, but let's pre-calc basic
                createdAt: t.createdAt
            };
        });


        return NextResponse.json({
            kpi: {
                revenue: { value: currentMonthRevenue, trend: revenueTrend },
                openTickets: { value: openTicketsCount },
                sla: { value: slaAtRiskCount },
                nps: { value: npsScore, label: npsLabel }
            },
            charts: {
                revenue: revenueChartData,
                ticketTypes: ticketTypeData
            },
            recentTickets
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
