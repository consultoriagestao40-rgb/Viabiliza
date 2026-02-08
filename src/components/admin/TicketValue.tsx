"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, Save, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface TicketValueProps {
    ticketId: string;
    initialValue: number | null;
}

export default function TicketValue({ ticketId, initialValue }: TicketValueProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue?.toString() || "");
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        setLoading(true);
        try {
            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: parseFloat(value) })
            });

            if (res.ok) {
                setIsEditing(false);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Valor do Serviço
                </h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
                        <Pencil className="h-3 w-3" /> Editar
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="flex gap-2">
                    <input
                        type="number"
                        step="0.01"
                        className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="0.00"
                    />
                    <Button size="sm" onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                        <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                </div>
            ) : (
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {initialValue
                        ? initialValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : <span className="text-neutral-400 text-lg font-normal">Não definido</span>
                    }
                </div>
            )}
        </div>
    );
}
