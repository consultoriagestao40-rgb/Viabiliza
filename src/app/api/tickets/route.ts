import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth"; // Assuming authOptions is exported
import { getServerSession } from "next-auth/next";
import { getOriginAddress, calculateTripCost } from "@/lib/services/cost-calculator";
import { getRouteData } from "@/lib/services/mileage";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { serviceType, description, location, urgency, scheduledDate, phone } = await req.json();

        if (!serviceType || !description || !location || !phone) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Update user phone number if provided
        await prisma.user.update({
            where: { id: session.user.id },
            data: { phone }
        });

        // --- Mileage & Cost Calculation ---
        let mileageData = null;
        let costData = null;
        let origin = "";

        try {
            origin = await getOriginAddress();
            mileageData = await getRouteData(origin, location);
            costData = await calculateTripCost(mileageData.distanceKm, mileageData.durationMin);
        } catch (error) {
            console.error("Mileage Calculation Error:", error);
            // We don't block ticket creation, but we log it and proceed without cost data
            // Or return 400 if strictly required. For now, proceeding with warning.
        }

        const ticket = await prisma.ticket.create({
            data: {
                userId: session.user.id,
                serviceType,
                description,
                location,
                urgency,
                scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
                status: "OPEN",

                // Cost Data
                distanceKm: mileageData?.distanceKm,
                durationMin: mileageData?.durationMin,
                totalDistanceKm: costData?.totalDistanceKm,

                displacementCost: costData?.displacementCost,

                gasPrice: costData?.gasPrice,
                gasPriceSource: costData?.gasPriceSource,

                fuelCostPerKm: costData?.fuelCostPerKm,
                maintenanceCostPerKm: costData?.maintenanceCostPerKm,
                depreciationCostPerKm: costData?.depreciationCostPerKm,
                totalCostPerKm: costData?.totalCostPerKm,

                isRouteCacheHit: mileageData?.isCacheHit || false,
            },
        });

        return NextResponse.json(
            {
                message: "Ticket created successfully",
                ticket,
                costDetails: costData ? {
                    distance: `${mileageData?.distanceKm.toFixed(2)} km`,
                    totalCost: `R$ ${costData.displacementCost.toFixed(2)}`
                } : null
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create ticket error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
