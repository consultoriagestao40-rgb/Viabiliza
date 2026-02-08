
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
    console.log("🗺️ [Google Maps] Starting distance calculation");
    console.log("🗺️ [Google Maps] Origin:", origin);
    console.log("🗺️ [Google Maps] Destination:", destination);

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || HARDCODED_KEY;
    console.log("🗺️ [Google Maps] API Key configured:", apiKey ? `Yes (${apiKey.substring(0, 10)}...)` : "NO - MISSING!");

    try {
        console.log("🗺️ [Google Maps] Making API request...");
        const response = await client.distancematrix({
            params: {
                origins: [origin],
                destinations: [destination],
                key: apiKey,
                mode: 'driving' as any // Cast safe
            }
        });

        console.log("🗺️ [Google Maps] API Response Status:", response.data.status);

        if (response.data.status !== "OK") {
            const errorMsg = `Google Maps API Error: ${response.data.status} - ${response.data.error_message || 'No error message'}`;
            console.error("❌ [Google Maps]", errorMsg);
            throw new Error(errorMsg);
        }

        const element = response.data.rows[0].elements[0];
        console.log("🗺️ [Google Maps] Route Element Status:", element.status);

        if (element.status !== "OK") {
            const errorMsg = `Route not found: ${element.status}`;
            console.error("❌ [Google Maps]", errorMsg);
            throw new Error(errorMsg);
        }

        const result = {
            distanceKm: element.distance.value / 1000,
            durationMin: element.duration.value / 60,
            originAddress: response.data.origin_addresses[0],
            destinationAddress: response.data.destination_addresses[0]
        };

        console.log("✅ [Google Maps] Success! Distance:", result.distanceKm.toFixed(2), "km");
        return result;

    } catch (error) {
        console.error("❌ [Google Maps] Service Error:", error);
        throw error;
    }
}
