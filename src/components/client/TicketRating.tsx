"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TicketRatingProps {
    ticketId: string;
    initialRating: number | null;
    initialReview: string | null;
}

export default function TicketRating({ ticketId, initialRating, initialReview }: TicketRatingProps) {
    const router = useRouter();
    const [rating, setRating] = useState(initialRating || 0);
    const [review, setReview] = useState(initialReview || "");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(!!initialRating);

    async function handleSubmit() {
        if (rating === 0) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, review }),
            });

            if (res.ok) {
                setSubmitted(true);
                router.refresh();
            } else {
                alert("Erro ao enviar avaliação.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center justify-center gap-2">
                <Star className="h-5 w-5 fill-green-600 text-green-600" />
                <span className="font-medium">Obrigado pela sua avaliação!</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <Star
                            className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`}
                        />
                    </button>
                ))}
            </div>

            <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Deixe um comentário sobre o atendimento..."
                className="w-full rounded-lg border border-neutral-300 p-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                rows={3}
            />

            <Button
                onClick={handleSubmit}
                disabled={loading || rating === 0}
                className="bg-primary-600 hover:bg-primary-700 text-white w-full sm:w-auto"
            >
                {loading ? "Enviando..." : "Enviar Avaliação"}
            </Button>
        </div>
    );
}
