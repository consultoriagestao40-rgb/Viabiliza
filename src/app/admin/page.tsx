'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Ticket, DollarSign, Activity, Users, ArrowUpRight, ArrowDownRight, RefreshCw, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { toast } from 'sonner';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Mapeamento de status para cores e labels
const STATUS_MAP: any = {
    OPEN: { label: 'Aberto', color: 'bg-yellow-100 text-yellow-800' },
    QUOTED: { label: 'Orçado', color: 'bg-blue-100 text-blue-800' },
    SCHEDULED: { label: 'Agendado', color: 'bg-purple-100 text-purple-800' },
    IN_PROGRESS: { label: 'Em Andamento', color: 'bg-orange-100 text-orange-800' },
    COMPLETED: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
    CANCELED: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};


export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/dashboard-stats');
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                toast.error("Erro ao carregar dados do dashboard.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
                    <p className="text-neutral-500">Carregando indicadores...</p>
                </div>
            </div>
        )
    }

    if (!data) return null;

    const { kpi, charts, recentTickets } = data;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Visão Geral</h2>
                <div className="flex gap-2">
                    <Link href="/admin/crm">
                        <Button variant="outline" className="gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Pipeline CRM
                        </Button>
                    </Link>
                    <button onClick={fetchDashboardData} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Atualizar">
                        <RefreshCw className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Receita Mensal"
                    value={kpi.revenue.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    trend={`${kpi.revenue.trend > 0 ? '+' : ''}${kpi.revenue.trend.toFixed(1)}%`}
                    trendUp={kpi.revenue.trend >= 0}
                    icon={DollarSign}
                    color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                />
                <KPICard
                    title="Chamados Abertos"
                    value={kpi.openTickets.value}
                    sub="Em atendimento"
                    icon={Ticket}
                    color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                />
                <KPICard
                    title="SLA em Risco"
                    value={kpi.sla.value}
                    sub="Atrasados > 3 dias"
                    isNegativeMetrics={true}
                    trendUp={kpi.sla.value > 0} // Red if > 0
                    icon={Activity}
                    color="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                />
                <KPICard
                    title="NPS Global (Est.)"
                    value={kpi.nps.value}
                    sub={kpi.nps.label}
                    icon={Users}
                    color="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Receita (Últimos 6 Meses)</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={charts.revenue}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
                                <Tooltip
                                    formatter={(value: any) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#000' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Ticket Distribution Chart */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-6">Chamados por Tipo</h3>
                    {charts.ticketTypes.length > 0 ? (
                        <>
                            <div className="h-[300px] w-full flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={charts.ticketTypes}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {charts.ticketTypes.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Legend */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <span className="block text-2xl font-bold text-neutral-900 dark:text-white">
                                            {charts.ticketTypes.reduce((acc: number, curr: any) => acc + curr.value, 0)}
                                        </span>
                                        <span className="text-xs text-neutral-500">Total</span>
                                    </div>
                                </div>
                            </div>
                            {/* Custom Legend */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {charts.ticketTypes.map((entry: any, index: number) => (
                                    <div key={entry.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-sm text-neutral-500 truncate" title={entry.name}>{entry.name} ({entry.value})</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-neutral-400">
                            Sem dados suficientes
                        </div>
                    )}

                </div>
            </div>

            {/* Recent Tickets Table */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                        <h3 className="font-bold text-neutral-900 dark:text-white">Chamados Recentes</h3>
                        {/* <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">Ver todos</button> */}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 dark:bg-neutral-800 text-neutral-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Categoria</th>
                                    <th className="px-6 py-3">Data</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {recentTickets.length === 0 ? (
                                    <tr><td colSpan={5} className="p-6 text-center text-neutral-500">Nenhum chamado recente.</td></tr>
                                ) : (
                                    recentTickets.map((row: any) => (
                                        <tr key={row.fullId}>
                                            <td className="px-6 py-4 font-mono text-neutral-600">#{row.id}</td>
                                            <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{row.client}</td>
                                            <td className="px-6 py-4 text-neutral-500">{row.cat}</td>
                                            <td className="px-6 py-4 text-neutral-500">{new Date(row.createdAt).toLocaleDateString('pt-BR')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_MAP[row.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                                    {STATUS_MAP[row.status]?.label || row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

function KPICard({ title, value, icon: Icon, trend, trendUp, sub, isNegativeMetrics, color }: any) {
    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-lg", color)}>
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                        (trendUp && !isNegativeMetrics) || (!trendUp && isNegativeMetrics)
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                        {trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{value}</h3>
                {sub && <p className="text-sm text-neutral-400 mt-1">{sub}</p>}
            </div>
        </div>
    )
}
