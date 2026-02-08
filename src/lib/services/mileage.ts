
import { PrismaClient } from "@prisma/client";
import { getDistance, RouteResult } from "./google-maps";
import crypto from 'crypto';

const prisma = new PrismaClient();

// Cache TTL: 7 days in milliseconds
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

export async function getRouteData(origin: string, destination: string): Promise<RouteResult & { isCacheHit: boolean }> {
    // 1. Normalize and Hash
    const normalizedHash = crypto
        .createHash('md5')
        .update(`${origin.trim().toLowerCase()}|${destination.trim().toLowerCase()}`)
        .digest('hex');

    // 2. Check Cache
    const cached = await prisma.routeCache.findUnique({
        where: { normalizedHash }
    });

    if (cached) {
        const isFresh = (new Date().getTime() - cached.updatedAt.getTime()) < CACHE_TTL;
        if (isFresh) {
            return {
                distanceKm: cached.distanceKm,
                durationMin: cached.durationMin,
                originAddress: cached.origin,
                destinationAddress: cached.destination,
                isCacheHit: true
            };
        }
    }

    // 3. Fetch from API
    const result = await getDistance(origin, destination);

    // 4. Save/Update Cache
    await prisma.routeCache.upsert({
        where: { normalizedHash },
        update: {
            origin: result.originAddress,
            destination: result.destinationAddress,
            distanceKm: result.distanceKm,
            durationMin: result.durationMin,
            updatedAt: new Date() // Refresh TTL
        },
        create: {
            normalizedHash,
            origin: result.originAddress,
            destination: result.destinationAddress,
            distanceKm: result.distanceKm,
            durationMin: result.durationMin
        }
    });

    return { ...result, isCacheHit: false };
}
