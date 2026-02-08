
export const SERVICE_RATES = {
    hourlyRate: 120.00,
    minHours: 2,
    minCost: 240.00 // 2 * 120
};

export function calculateServiceCost(hoursBlocked: number): number {
    const billableHours = Math.max(hoursBlocked, SERVICE_RATES.minHours);
    return billableHours * SERVICE_RATES.hourlyRate;
}

export function calculateTotalEstimate(displacementCost: number, hoursBlocked: number = 2): number {
    return displacementCost + calculateServiceCost(hoursBlocked);
}
