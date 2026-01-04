
export interface Trip {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  distanceKm: number;
  fuelPriceAtTime: number;
  consumptionAtTime: number;
  totalCost: number;
  fuelConsumed: number;
  note?: string;
  startOdometer: number;
  endOdometer: number;
}

export interface ActiveTrip {
  startDate: string;
  startTime: string;
  startOdometer: number;
  note?: string;
}

export interface AppSettings {
  fuelPrice: number; // EUR/L
  averageConsumption: number; // L/100km
}

export interface HistoryStats {
  totalDistance: number;
  totalCost: number;
  totalFuel: number;
  averageTripDistance: number;
}
