"use client";

import { useState } from "react";
import { User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Technician {
    id: string;
    name: string | null;
    specialty: string | null;
}

interface TicketAssignmentProps {
    ticketId: string;
    currentTechnicianId: string | null;
    technicians: Technician[];
}

export default function TicketAssignment({ ticketId, currentTechnicianId, technicians }: TicketAssignmentProps) {
    const router = useRouter();
    const [selectedTechId, setSelectedTechId] = useState<string>(currentTechnicianId || "");
    const [loading, setLoading] = useState(false);

    async function handleAssign() {
        if (!selectedTechId) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ technicianId: selectedTechId }),
            });

            if (res.ok) {
                router.refresh();
                alert("Técnico atribuído com sucesso!");
            } else {
                alert("Erro ao atribuir técnico.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Atribuir Técnico</h3>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Selecione o Profissional</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                        <select
                            value={selectedTechId}
                            onChange={(e) => setSelectedTechId(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm appearance-none"
                        >
                            <option value="">-- Pendente --</option>
                            {technicians.map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                    {tech.name} {tech.specialty ? `(${tech.specialty})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <Button
                    onClick={handleAssign}
                    disabled={loading || selectedTechId === currentTechnicianId}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {loading ? 'Salvando...' : 'Atualizar Atribuição'}
                </Button>
            </div>
        </div>
    );
}
