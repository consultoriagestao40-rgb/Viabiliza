
import { PrismaClient } from "@prisma/client";
import { getReferenceGasPrice } from "./gas-price";

const prisma = new PrismaClient();

interface CostBreakdown {
    distanceKm: number;
    totalDistanceKm: number;
    durationMin: number;

    gasPrice: number;
    gasPriceSource: string;

    fuelCostPerKm: number;
    maintenanceCostPerKm: number;
    depreciationCostPerKm: number;
    totalCostPerKm: number;

    displacementCost: number;
}

const DEFAULTS = {
    origin: "Rua Rio Pequiri, 699, Pinhais - PR, Brasil",
    multiplier: 2, // Round trip
    consumption: 10, // km/L
    maintenance: 0.20, // R$/km
    vehicleValue: 45000,
    vehicleResidual: 30000,
    vehicleLifecycle: 150000
};

export async function calculateTripCost(distanceKm: number, durationMin: number): Promise<CostBreakdown> {
    // 1. Fetch Settings
    const settings = await prisma.systemSetting.findMany({
        where: {
            key: {
                in: [
                    'displacement_multiplier',
                    'vehicle_fuel_consumption',
                    'maintenance_tires_cost_km',
                    'vehicle_value_current',
                    'vehicle_value_residual',
                    'vehicle_km_lifecycle'
                ]
            }
        }
    });

    const getSetting = (key: string, defaultVal: number) => {
        const s = settings.find(s => s.key === key);
        return s ? parseFloat(s.value) : defaultVal;
    };

    const multiplier = getSetting('displacement_multiplier', DEFAULTS.multiplier);
    const consumption = getSetting('vehicle_fuel_consumption', DEFAULTS.consumption);
    const maintenance = getSetting('maintenance_tires_cost_km', DEFAULTS.maintenance);
    const vValue = getSetting('vehicle_value_current', DEFAULTS.vehicleValue);
    const vResidual = getSetting('vehicle_value_residual', DEFAULTS.vehicleResidual);
    const vLifecycle = getSetting('vehicle_km_lifecycle', DEFAULTS.vehicleLifecycle);

    // 2. Fetch Gas Price
    const gas = await getReferenceGasPrice();

    // 3. Calculate Components
    const fuelCostKm = gas.price / consumption;

    let depreciationKm = 0;
    if (vLifecycle > 0 && vValue > vResidual) {
        depreciationKm = (vValue - vResidual) / vLifecycle;
    }

    const totalCostKm = fuelCostKm + maintenance + depreciationKm;

    const totalDistance = distanceKm * multiplier;
    const totalCost = totalDistance * totalCostKm;

    return {
        distanceKm,
        totalDistanceKm: totalDistance,
        durationMin,

        gasPrice: gas.price,
        gasPriceSource: gas.source,

        fuelCostPerKm: fuelCostKm,
        maintenanceCostPerKm: maintenance,
        depreciationCostPerKm: depreciationKm,
        totalCostPerKm: totalCostKm,

        displacementCost: totalCost
    };
}

export async function getOriginAddress(): Promise<string> {
    const setting = await prisma.systemSetting.findUnique({ where: { key: 'origin_address' } });
    return setting ? setting.value : DEFAULTS.origin;
}
