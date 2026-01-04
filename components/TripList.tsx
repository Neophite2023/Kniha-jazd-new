import React, { useState } from 'react';
import { Trip } from '../types';

interface TripListProps {
  trips: Trip[];
  onDelete: (id: string) => void;
  onBack: () => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onDelete, onBack }) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => setConfirmingId(id);
  const cancelDelete = () => setConfirmingId(null);
  const confirmDelete = (id: string) => {
    onDelete(id);
    setConfirmingId(null);
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-full border border-white/10 transition-all text-white active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">História Jázd</h2>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{trips.length} Celkových záznamov</div>
          </div>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-32 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-white/5">
          <p className="text-zinc-700 font-black uppercase tracking-[0.3em] text-[10px]">História je prázdna</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map(trip => (
            <div key={trip.id} className="group bg-zinc-900/40 rounded-3xl border border-white/[0.04] relative overflow-hidden transition-all hover:bg-zinc-900/60 hover:border-white/[0.08]">
              {confirmingId === trip.id && (
                <div className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
                  <p className="font-black text-white mb-6 uppercase tracking-[0.2em] text-[10px]">Vymazať tento záznam?</p>
                  <div className="flex gap-3 w-full max-w-[240px]">
                    <button onClick={cancelDelete} className="flex-1 py-3 bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all">Nie</button>
                    <button onClick={() => confirmDelete(trip.id)} className="flex-1 py-3 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all">Áno, zmazať</button>
                  </div>
                </div>
              )}

              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {/* Modern Date Chip */}
                  <div className="flex flex-col items-center justify-center bg-black text-white w-14 h-14 rounded-2xl border border-white/5 shadow-xl">
                    <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mb-0.5">{new Date(trip.date).toLocaleDateString('sk-SK', { month: 'short' })}</span>
                    <span className="text-xl font-black tabular-nums">{new Date(trip.date).getDate()}</span>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="text-2xl font-black text-white tracking-tighter group-hover:translate-x-1 transition-transform">{trip.distanceKm} <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-normal">km</span></div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5 tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {trip.startTime} – {trip.endTime}
                      </div>
                      <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                      <div className="text-[8px] font-black text-zinc-700 uppercase tracking-tighter">
                        {trip.startOdometer} ➔ {trip.endOdometer}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-10 border-t border-white/[0.03] sm:border-t-0 pt-4 sm:pt-0">
                  <div className="text-right">
                    <div className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-0.5">Náklady</div>
                    <div className="text-xl font-black text-white tracking-tighter">{trip.totalCost.toFixed(2)} €</div>
                  </div>
                  <button 
                    onClick={() => handleDeleteClick(trip.id)} 
                    className="w-10 h-10 flex items-center justify-center text-zinc-800 hover:text-white hover:bg-white/[0.05] rounded-full transition-all active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              
              {trip.note && (
                <div className="px-5 pb-5 pt-0">
                  <div className="bg-white/[0.02] border border-white/[0.03] rounded-xl px-4 py-2 text-[10px] font-medium text-zinc-500 italic">
                    "{trip.note}"
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripList;