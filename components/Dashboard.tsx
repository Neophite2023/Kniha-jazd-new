import React from 'react';
import { Trip, HistoryStats, ActiveTrip, AppSettings } from '../types';

interface DashboardProps {
  stats: HistoryStats;
  recentTrips: Trip[];
  activeTrip: ActiveTrip | null;
  settings: AppSettings;
  lastOdometer: number;
  onViewAll: () => void;
  onAddTrip: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  stats,
  recentTrips,
  activeTrip,
  settings,
  lastOdometer,
  onViewAll,
  onAddTrip
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-sm">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Mesačný Nájazd • {stats.currentMonthName} {stats.currentYear}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight text-zinc-950">{stats.monthlyDistance.toFixed(0)}</span>
          <span className="text-xl font-medium text-zinc-400">km</span>
        </div>
      </div>

      {settings.serviceReminders && settings.serviceReminders.map(reminder => (
        <div key={reminder.id} className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-sm space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                {reminder.name}
              </span>
              <div className="text-2xl font-bold text-zinc-950">
                {Math.max(0, reminder.interval - (lastOdometer - reminder.lastServiceOdometer)).toLocaleString()}
                <span className="text-sm font-medium text-zinc-400 ml-2">km do cieľa</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-zinc-300">pri {(reminder.lastServiceOdometer + reminder.interval).toLocaleString()} km</span>
            </div>
          </div>

          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${(reminder.interval - (lastOdometer - reminder.lastServiceOdometer)) < 1000 ? 'bg-red-500' : 'bg-zinc-950'
                }`}
              style={{
                width: `${Math.min(100, Math.max(0, ((lastOdometer - reminder.lastServiceOdometer) / reminder.interval) * 100))}%`
              }}
            />
          </div>
        </div>
      ))}

      {activeTrip && (
        <div className="bg-zinc-950 rounded-3xl p-4 flex items-center justify-between shadow-xl ring-1 ring-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-zinc-950 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-400">Práve prebieha</div>
              <div className="text-sm font-bold text-white uppercase tracking-tight">{activeTrip.startTime} • {activeTrip.startOdometer} km</div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddTrip();
            }}
            className="px-6 py-2.5 bg-white text-zinc-950 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 active:scale-95 transition-all"
          >
            Ukončiť
          </button>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Nedávne Aktivity</h3>
          <button onClick={onViewAll} className="text-xs font-medium text-zinc-500 hover:text-white transition-colors">Všetky</button>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-sm">
          {recentTrips.length > 0 ? (
            recentTrips.map((trip, idx) => (
              <div key={trip.id} className={`p-4 flex justify-between items-center active:bg-zinc-50 transition-colors ${idx !== recentTrips.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-zinc-950 text-base tracking-tight">{trip.distanceKm.toFixed(1)} km</div>
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      {new Date(trip.date).toLocaleDateString('sk-SK', { day: '2-digit', month: 'short' })} • {trip.startTime}
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="font-bold text-zinc-950 text-sm tabular-nums">{trip.totalCost.toFixed(2)} €</div>
                    <div className="text-[10px] font-medium text-zinc-400 uppercase">{trip.fuelConsumed.toFixed(1)} L</div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Žiadne záznamy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;