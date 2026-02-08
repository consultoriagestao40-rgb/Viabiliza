
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_FALLBACK_PRICE = 5.89; // R$/L

export async function getReferenceGasPrice(): Promise<{ price: number, source: string, date: Date }> {
    // 1. Try to get 4-week moving average (ideal)
    // For MVP simplicy, getting the LATEST valid price first.
    // In a real scenario, we would aggregate the last 4 weeks.

    const latest = await prisma.gasPriceHistory.findFirst({
        orderBy: { date: 'desc' }
    });

    if (latest) {
        return {
            price: latest.price,
            source: latest.source,
            date: latest.date
        };
    }

    // 2. Fallback to System Settings? (Optional, if we want to store default there)
    const setting = await prisma.systemSetting.findUnique({
        where: { key: 'gas_price_fallback' }
    });

    if (setting) {
        return {
            price: parseFloat(setting.value),
            source: 'FALLBACK_SETTING',
            date: new Date()
        };
    }

    // 3. Hard Fallback
    return {
        price: DEFAULT_FALLBACK_PRICE,
        source: 'FALLBACK_HARDCODED',
        date: new Date()
    };
}
