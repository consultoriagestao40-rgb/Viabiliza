import { PrismaClient } from "@prisma/client";
import KanbanBoard from "@/components/admin/KanbanBoard";

const prisma = new PrismaClient();

async function getTickets() {
    return await prisma.ticket.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
}

export default async function CRMPage() {
    const tickets = await getTickets();

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Pipeline de Vendas (CRM)</h2>
                    <p className="text-neutral-500">Gerencie o fluxo de chamados desde a prospecção até a conclusão.</p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard initialTickets={tickets} />
            </div>
        </div>
    );
}
