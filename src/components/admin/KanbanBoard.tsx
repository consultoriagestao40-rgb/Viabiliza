"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Ticket } from "@prisma/client"; // Or a specific type if needed
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Extend Ticket type to include User
type TicketWithUser = Ticket & {
    user: {
        name: string | null;
        email: string;
    };
};

interface KanbanBoardProps {
    initialTickets: TicketWithUser[];
}

const COLUMNS = [
    { id: "OPEN", title: "Novo", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { id: "QUOTING", title: "Em Orçamento", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { id: "SCHEDULED", title: "Agendado", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { id: "IN_PROGRESS", title: "Em Execução", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { id: "COMPLETED", title: "Concluído", color: "bg-green-100 text-green-700 border-green-200" },
    { id: "CANCELED", title: "Perdido/Cancelado", color: "bg-red-100 text-red-700 border-red-200" },
];

export default function KanbanBoard({ initialTickets }: KanbanBoardProps) {
    const router = useRouter();
    const [tickets, setTickets] = useState(initialTickets);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId;
        const oldStatus = source.droppableId;

        // Optimistic update
        const updatedTickets = tickets.map(t =>
            t.id === draggableId ? { ...t, status: newStatus } : t
        );
        setTickets(updatedTickets);

        // API Call
        try {
            const res = await fetch(`/api/tickets/${draggableId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                // Revert on failure
                console.error("Failed to update status");
                setTickets(initialTickets); // Ideally revert just the change, but this is simple for now
                alert("Erro ao atualizar status do chamado.");
            } else {
                router.refresh(); // Refresh server data mostly for consistency
            }
        } catch (error) {
            console.error(error);
            setTickets(initialTickets);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full overflow-x-auto gap-4 py-4 pb-8 min-w-[1200px]">
                {COLUMNS.map((column) => {
                    const columnTickets = tickets.filter(t => t.status === column.id);

                    return (
                        <div key={column.id} className="w-80 flex-shrink-0 flex flex-col bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                            {/* Header */}
                            <div className={`p-3 border-b border-neutral-200 dark:border-neutral-800 rounded-t-xl flex justify-between items-center ${column.color} bg-opacity-20`}>
                                <h3 className="font-bold text-sm">{column.title}</h3>
                                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {columnTickets.length}
                                </span>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 p-2 space-y-2 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? "bg-neutral-200/50 dark:bg-neutral-800/50" : ""
                                            }`}
                                    >
                                        {columnTickets.map((ticket, index) => (
                                            <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group ${snapshot.isDragging ? "shadow-xl ring-2 ring-primary-500 rotate-1" : ""
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs font-bold text-neutral-500">#{ticket.id.slice(-4)}</span>
                                                            {ticket.urgency === 'Emergência' && (
                                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                                            )}
                                                        </div>
                                                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-1 line-clamp-1">
                                                            {ticket.serviceType}
                                                        </h4>
                                                        <p className="text-xs text-neutral-500 mb-3 truncate">{ticket.user?.name}</p>

                                                        <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                                                            <Calendar className="h-3 w-3" />
                                                            {format(new Date(ticket.createdAt), "dd/MM", { locale: ptBR })}
                                                        </div>

                                                        {/* Hover Action: Go to Details */}
                                                        <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-700 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link href={`/admin/tickets/${ticket.id}`} className="text-xs font-bold text-primary-600 hover:underline">
                                                                Ver Detalhes
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}
