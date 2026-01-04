import React from 'react';
import { Trip, HistoryStats, ActiveTrip } from '../types';

interface DashboardProps {
  stats: HistoryStats;
  recentTrips: Trip[];
  activeTrip: ActiveTrip | null;
  onViewAll: () => void;
  onAddTrip: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  recentTrips, 
  activeTrip,
  onViewAll, 
  onAddTrip
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Active Trip Banner - Modern Focus UI */}
      {activeTrip && (
        <div className="relative overflow-hidden bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
          {/* pointer-events-none is CRITICAL here to prevent blocking clicks */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-zinc-900 animate-ping"></div>
            </div>
            <div>
              <div className="font-black text-white text-[10px] tracking-[0.2em] uppercase opacity-50 mb-0.5">V pohybe</div>
              <div className="text-sm font-bold text-white uppercase tracking-tight">{activeTrip.startTime} • {activeTrip.startOdometer} km</div>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddTrip();
            }}
            className="relative z-20 px-6 py-3 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
          >
            Koniec
          </button>
        </div>
      )}

      {/* Stats Grid was removed from here */}

      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <div>
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">Posledné záznamy</h3>
            <div className="h-0.5 w-6 bg-white/20 rounded-full"></div>
          </div>
          {/* Tlačidlo ARCHÍV bolo odstránené na žiadosť používateľa */}
        </div>

        <div className="space-y-2">
          {recentTrips.length > 0 ? (
            recentTrips.map(trip => (
              <div key={trip.id} className="bg-zinc-900/30 p-4 rounded-2xl border border-white/[0.04] flex justify-between items-center hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-black text-zinc-500 rounded-xl flex items-center justify-center border border-white/5 group-hover:text-white group-hover:border-white/20 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-black text-white text-lg tracking-tighter">{trip.distanceKm} <span className="text-[9px] text-zinc-600 font-bold uppercase ml-0.5 tracking-normal">km</span></div>
                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{new Date(trip.date).toLocaleDateString('sk-SK', { day: '2-digit', month: 'short' })} • {trip.startTime}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm text-white">{trip.totalCost.toFixed(2)} €</div>
                  <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">{trip.fuelConsumed.toFixed(1)} Litrov</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-white/5">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-zinc-600 font-bold uppercase tracking-widest text-[8px] mb-2">Zatiaľ žiadne dáta</p>
              <p className="text-zinc-800 text-[7px] uppercase tracking-[0.4em]">Kliknite na + v navigácii</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;