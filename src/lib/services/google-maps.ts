import { Client } from "@googlemaps/google-maps-services-js";

const HARDCODED_KEY = "AIzaSyDwnjcn9FDUpLfD2-3rO9NHQqSkmlvSeTk";

const client = new Client({});

export interface RouteResult {
    distanceKm: number;
    durationMin: number;
    originAddress: string;
    destinationAddress: string;
}

export async function getDistance(origin: string, destination: string): Promise<RouteResult> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || HARDCODED_KEY;
    
    console.log("🗺️ Using API key:", apiKey ? "YES" : "NO");

    try {
        const response = await client.distancematrix({
            params: {
                origins: [origin],
                destinations: [destination],
                key: apiKey,
                mode: 'driving' as any
            }
        });

        if (response.data.status !== "OK") {
            throw new Error(`Google Maps API Error: ${response.data.status}`);
        }

        const element = response.data.rows[0].elements[0];

        if (element.status !== "OK") {
            throw new Error(`Route not found: ${element.status}`);
        }

        const result = {
            distanceKm: element.distance.value / 1000,
            durationMin: element.duration.value / 60,
            originAddress: response.data.origin_addresses[0],
            destinationAddress: response.data.destination_addresses[0]
        };
        
        console.log("✅ Distance calculated:", result.distanceKm, "km");
        return result;

    } catch (error) {
        console.error("❌ Google Maps Error:", error);
        throw error;
    }
}
