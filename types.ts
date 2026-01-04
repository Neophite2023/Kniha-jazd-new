
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

export interface ServiceReminder {
  id: string;
  name: string;
  interval: number;
  lastServiceOdometer: number;
}

export interface AppSettings {
  fuelPrice: number; // EUR/L
  averageConsumption: number; // L/100km
  serviceReminders: ServiceReminder[];
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
