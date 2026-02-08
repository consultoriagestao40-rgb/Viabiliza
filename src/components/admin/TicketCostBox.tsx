
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, Car, Clock, DollarSign } from "lucide-react";
import { SERVICE_RATES } from "@/lib/services/service-cost";

interface TicketCostBoxProps {
    displacementCost: number | null;
    distanceKm: number | null;
    durationMin?: number | null;
}

export default function TicketCostBox({ displacementCost, distanceKm }: TicketCostBoxProps) {
    // Defaults if data is missing (e.g. old tickets)
    const validDisplacement = displacementCost || 0;
    const minServiceCost = SERVICE_RATES.minCost;
    const totalEstimate = validDisplacement + minServiceCost;

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Estimativa de Custos
            </h3>

            <div className="space-y-4">
                {/* Displacement Section */}
                <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                            <Car className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Deslocamento</p>
                            <p className="text-xs text-neutral-500">
                                {distanceKm ? `${distanceKm.toFixed(1)} km (ida)` : 'Distância n/a'}
                            </p>
                        </div>
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">
                        {validDisplacement > 0 ? `R$ ${validDisplacement.toFixed(2)}` : 'R$ 0,00'}
                    </span>
                </div>

                {/* Service Section */}
                <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600">
                            <Clock className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">Serviço Técnico</p>
                            <p className="text-xs text-neutral-500">
                                Mínimo {SERVICE_RATES.minHours}h (R$ {SERVICE_RATES.hourlyRate}/h)
                            </p>
                        </div>
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">
                        R$ {minServiceCost.toFixed(2)}
                    </span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                    <p className="font-bold text-neutral-700 dark:text-neutral-300">Total Estimado</p>
                    <p className="text-xl font-extrabold text-green-600 dark:text-green-400">
                        R$ {totalEstimate.toFixed(2)}
                    </p>
                </div>

                <p className="text-xs text-neutral-400 text-center mt-2">
                    * Valor pode variar caso o serviço exceda {SERVICE_RATES.minHours} horas (+ R$ {SERVICE_RATES.hourlyRate}/h).
                </p>
            </div>
        </div>
    );
}
