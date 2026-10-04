export type VehicleType = 'bike' | 'car';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export interface Employee {
  id: string;
  name: string;
  email: string;
  company: string;
  companyDomain: string;
  employeeId: string;
  department: string;
  role: string;
  avatarUrl?: string;
  verificationStatus: VerificationStatus;
  workShift: string;
  campusOffice: string;
  phone: string;
  rating: number;
  ridesCompleted: number;
  greenWalletBalance: number; // accumulated INR from ₹3/₹5 subsidies
  co2SavedKg: number;
  joinedDate: string;
}

export interface Vehicle {
  type: VehicleType;
  makeModel: string;
  registrationNumber: string;
  fuelType: 'petrol' | 'electric' | 'diesel';
  mileageKmPerUnit: number; // km/L for petrol/diesel, km/kWh for EV
  totalSeats: number;
  helmetProvided?: boolean; // Essential safety policy for bike pooling
}

export interface RidePassenger {
  employee: Employee;
  status: 'confirmed' | 'requested' | 'completed' | 'cancelled';
  pickupPoint: string;
  joinedAt: string;
  farePaid: number;
  companySubsidyReceived: number;
}

export interface Ride {
  id: string;
  host: Employee;
  vehicle: Vehicle;
  poolType: VehicleType;
  origin: string;
  originCoords?: { lat: number; lng: number };
  destinationCampus: string;
  destinationCoords?: { lat: number; lng: number };
  pathCoordinates?: Array<{ lat: number; lng: number }>;
  departureTime: string;
  departureDate: string;
  distanceKm: number;
  durationMinutes: number;
  totalSeats: number;
  availableSeats: number;
  passengers: RidePassenger[];
  
  // Fuel & Financials
  fuelRatePerUnit: number; // e.g., 102.5 for petrol
  totalTripFuelCost: number; // total estimated fuel cost for entire commute
  standardPerRiderSplit: number; // fair split among all occupants (host + riders)
  companySubsidyPerRide: number; // strictly ₹3 for bike, ₹5 for car
  riderPayableAmount: number; // standardPerRiderSplit - companySubsidyPerRide (or floor 0)
  hostNetEarnings: number; // riderPayableAmount + companySubsidyPerRide from corporate benefit

  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  routeHighlights: string[];
  notes?: string;
  coworkersOnly: boolean; // restricted to same company vs campus-wide
}

export interface VerificationRequest {
  id: string;
  employeeName: string;
  company: string;
  workEmail: string;
  employeeCode: string;
  department: string;
  idCardProofName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface GreenTransaction {
  id: string;
  rideId: string;
  date: string;
  type: 'bike_subsidy' | 'car_subsidy' | 'fuel_split_received' | 'fuel_split_paid' | 'wallet_redemption';
  amount: number;
  poolType?: VehicleType;
  description: string;
  status: 'credited' | 'debited';
}
