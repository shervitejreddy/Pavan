import { VehicleType } from '../types/commute';

export interface FuelCalculationParams {
  distanceKm: number;
  vehicleType: VehicleType;
  fuelType: 'petrol' | 'electric' | 'diesel';
  mileageKmPerUnit?: number;
  fuelPricePerUnit?: number;
  riderCount?: number; // default 1 for bike, 1-3 for car
}

export interface SplitResult {
  totalFuelCost: number;
  totalOccupants: number;
  baseSplitPerPerson: number;
  companySubsidyPerRide: number; // ₹3 for bike, ₹5 for car
  netRiderPayable: number;
  hostNetPayout: number;
  co2SavedKg: number;
  soloCabCostEstimate: number;
  totalCommuterSavings: number;
}

export const COMPANY_SUBSIDY_RATES = {
  bike: 3.0, // ₹3 per completed bike pool
  car: 5.0,  // ₹5 per completed car pool
} as const;

export const DEFAULT_FUEL_RATES = {
  petrol: 107.41, // INR per liter in Hyderabad / Cyberabad tech hubs
  diesel: 95.65,  // INR per liter in Telangana
  electric: 8.80, // INR per unit kWh in Hyderabad
};

export const DEFAULT_MILEAGE = {
  bike: {
    petrol: 38, // km per liter
    electric: 35, // km per kWh
    diesel: 45,
  },
  car: {
    petrol: 14, // km per liter
    electric: 7.5, // km per kWh
    diesel: 18,
  },
};

export function calculateFuelSplit(params: FuelCalculationParams): SplitResult {
  const {
    distanceKm,
    vehicleType,
    fuelType,
    mileageKmPerUnit = DEFAULT_MILEAGE[vehicleType][fuelType],
    fuelPricePerUnit = DEFAULT_FUEL_RATES[fuelType],
    riderCount = vehicleType === 'bike' ? 1 : 2,
  } = params;

  // Safe checks
  const safeDistance = Math.max(0.5, distanceKm);
  const safeMileage = Math.max(1, mileageKmPerUnit);
  const safeFuelPrice = Math.max(1, fuelPricePerUnit);
  const safeRiders = Math.max(1, riderCount);

  // Total trip fuel consumption
  const fuelUsed = safeDistance / safeMileage;
  const totalFuelCost = Math.round((fuelUsed * safeFuelPrice) * 10) / 10;

  // Total occupants = 1 host driver + riders
  const totalOccupants = 1 + safeRiders;
  
  // Fair equal split across all occupants
  const baseSplitPerPerson = Math.round((totalFuelCost / totalOccupants) * 10) / 10;

  // Corporate green commute subsidy
  const companySubsidyPerRide = COMPANY_SUBSIDY_RATES[vehicleType];

  // Net payable by commuter rider after company benefit deduction
  const netRiderPayable = Math.max(1, Math.round((baseSplitPerPerson - companySubsidyPerRide) * 10) / 10);

  // Host driver receives rider's share plus the company's direct green contribution
  const hostNetPayout = Math.round((netRiderPayable * safeRiders + companySubsidyPerRide * safeRiders) * 10) / 10;

  // CO2 savings compared to solo private vehicle / cab (approx 0.11kg/km for 2-wheeler, 0.16kg/km for 4-wheeler)
  const co2Factor = vehicleType === 'bike' ? 0.095 : 0.155;
  const co2SavedKg = Math.round((safeDistance * safeRiders * co2Factor) * 10) / 10;

  // Approximate commercial cab / auto fare comparison for IT workers
  const soloCabCostEstimate = Math.round(
    vehicleType === 'bike'
      ? Math.max(60, safeDistance * 14 + 30) // Bike taxi / auto base
      : Math.max(150, safeDistance * 22 + 60) // Prime sedan / app cab
  );

  const totalCommuterSavings = Math.max(0, soloCabCostEstimate - netRiderPayable);

  return {
    totalFuelCost,
    totalOccupants,
    baseSplitPerPerson,
    companySubsidyPerRide,
    netRiderPayable,
    hostNetPayout,
    co2SavedKg,
    soloCabCostEstimate,
    totalCommuterSavings,
  };
}
