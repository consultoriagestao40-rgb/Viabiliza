
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export interface RouteResult {
    distanceKm: number;
    durationMin: number;
    originAddress: string;
    destinationAddress: string;
}

export async function getDistance(origin: string, destination: string): Promise<RouteResult> {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
        throw new Error("GOOGLE_MAPS_API_KEY is not configured");
    }

    try {
        const response = await client.distancematrix({
            params: {
                origins: [origin],
                destinations: [destination],
                key: process.env.GOOGLE_MAPS_API_KEY,
                mode: 'driving' as any // Cast safe
            }
        });

        if (response.data.status !== "OK") {
            throw new Error(`Google Maps API Error: ${response.data.status}`);
        }

        const element = response.data.rows[0].elements[0];

        if (element.status !== "OK") {
            throw new Error(`Route not found: ${element.status}`);
        }

        return {
            distanceKm: element.distance.value / 1000,
            durationMin: element.duration.value / 60,
            originAddress: response.data.origin_addresses[0],
            destinationAddress: response.data.destination_addresses[0]
        };

    } catch (error) {
        console.error("Google Maps Service Error:", error);
        throw error;
    }
}
