import { PrismaClient } from "@prisma/client";
import { User, Star, DollarSign, Plus, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

async function getTechnicians() {
    const technicians = await prisma.user.findMany({
        where: { role: 'TECHNICIAN' },
        include: {
            assignedTickets: {
                where: { status: 'COMPLETED' },
                select: {
                    value: true,
                    rating: true
                }
            }
        }
    });

    return technicians.map(tech => {
        const totalRevenue = tech.assignedTickets.reduce((sum, t) => sum + (t.value || 0), 0);
        const ratings = tech.assignedTickets.filter(t => t.rating !== null).map(t => t.rating as number);
        const averageRating = ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

        return {
            ...tech,
            stats: {
                revenue: totalRevenue,
                rating: averageRating,
                completedTickets: tech.assignedTickets.length
            }
        };
    });
}

export default async function TechniciansPage() {
    const technicians = await getTechnicians();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Equipe Técnica</h2>
                    <p className="text-neutral-500">Gerencie seus técnicos e acompanhe o desempenho.</p>
                </div>
                <Link href="/admin/technicians/new">
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                        <Plus className="h-4 w-4 mr-2" /> Novo Técnico
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technicians.map((tech) => (
                    <div key={tech.id} className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col gap-4">

                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-xl">
                                {tech.name?.[0] || 'T'}
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900 dark:text-white">{tech.name}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{tech.specialty || 'Generalista'}</p>
                            </div>
                        </div>

                        <div className="border-t border-neutral-100 dark:border-neutral-800 my-2"></div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-1">
                                    <Trophy className="h-3 w-3" />
                                    <span className="text-xs font-medium">Score</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-lg font-bold text-neutral-900 dark:text-white">{tech.stats.rating.toFixed(1)}</span>
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                </div>
                            </div>
                            <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span className="text-xs font-medium">Receita</span>
                                </div>
                                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                    R$ {tech.stats.revenue.toLocaleString('pt-BR')}
                                </p>
                            </div>
                        </div>

                        <div className="text-xs text-neutral-400 text-center mt-auto pt-2">
                            {tech.stats.completedTickets} serviços concluídos
                        </div>

                    </div>
                ))}

                {technicians.length === 0 && (
                    <div className="col-span-full py-12 text-center text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
                        <User className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
                        <p className="font-medium">Nenhum técnico cadastrado</p>
                        <p className="text-sm">Clique em "Novo Técnico" para começar.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
