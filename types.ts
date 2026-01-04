
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
  serviceInterval?: number; // km (e.g. 15000)
  lastServiceOdometer?: number; // km at which last service was done
  serviceName?: string; // custom name (e.g. "Výmena oleja")
}

export interface HistoryStats {
  totalDistance: number;
  monthlyDistance: number;
  currentMonthName: string;
  currentYear: number;
  totalCost: number;
  totalFuel: number;
  averageTripDistance: number;
}
