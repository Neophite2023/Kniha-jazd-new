import React, { useState, useEffect } from 'react';
import { Trip, AppSettings, ActiveTrip } from '../types';

interface TripFormProps {
  settings: AppSettings;
  activeTrip: ActiveTrip | null;
  onStart: (trip: ActiveTrip) => void;
  onSave: (trip: Trip) => void;
  onCancel: () => void;
  lastTripEndOdometer: number;
}

const TripForm: React.FC<TripFormProps> = ({ 
  settings, 
  activeTrip, 
  onStart, 
  onSave, 
  onCancel,
  lastTripEndOdometer 
}) => {
  const [odometer, setOdometer] = useState<string>(
    activeTrip 
      ? activeTrip.startOdometer.toString() 
      : (lastTripEndOdometer > 0 ? lastTripEndOdometer.toString() : '')
  );
  const [note, setNote] = useState<string>(activeTrip?.note || '');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateId = () => Math.random().toString(36).substring(2, 10);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const startVal = parseFloat(odometer);
    if (isNaN(startVal) || startVal < 0) return;
    const now = new Date();
    onStart({
      startDate: now.toISOString().split('T')[0],
      startTime: now.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }),
      startOdometer: startVal,
      note: note,
    });
  };

  const handleEnd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;
    const endVal = parseFloat(odometer);
    if (isNaN(endVal) || endVal <= activeTrip.startOdometer) return;

    const distance = endVal - activeTrip.startOdometer;
    const fuelConsumed = (distance / 100) * settings.averageConsumption;
    const totalCost = fuelConsumed * settings.fuelPrice;
    const now = new Date();
    const endTimeStr = now.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });

    onSave({
      id: generateId(),
      date: activeTrip.startDate,
      startTime: activeTrip.startTime,
      endTime: endTimeStr,
      distanceKm: parseFloat(distance.toFixed(2)),
      startOdometer: activeTrip.startOdometer,
      endOdometer: endVal,
      fuelPriceAtTime: settings.fuelPrice,
      consumptionAtTime: settings.averageConsumption,
      fuelConsumed: parseFloat(fuelConsumed.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      note: note.trim() || activeTrip.note,
    });
  };

  return (
    <div className="max-w-md mx-auto animate-in zoom-in-95 duration-300">
      <div className="bg-zinc-900 border border-white/10 p-5 sm:p-8 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
              {activeTrip ? 'Cieľ' : 'Štart'}
            </h2>
            <div className="h-1 w-6 bg-white/30 rounded-full mt-1"></div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-white tracking-widest uppercase">{activeTrip ? 'Ukončenie' : 'Zahájenie'}</span>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{activeTrip ? 'Krok 02' : 'Krok 01'}</span>
          </div>
        </div>
        
        <div className="mb-6 py-4 bg-black rounded-2xl flex flex-col items-center justify-center border border-white/5 shadow-inner">
          <div className="text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg">{currentTime || '00:00'}</div>
          <div className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em] mt-1">{currentDate}</div>
        </div>

        <form onSubmit={activeTrip ? handleEnd : handleStart} className="space-y-5">
          <div className="group">
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1.5 ml-1 group-focus-within:text-white transition-colors">Tachometer (km)</label>
            <input 
              type="number" 
              inputMode="decimal"
              required
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="w-full px-0 py-2 bg-transparent border-b border-white/10 focus:border-white outline-none transition-all text-3xl font-black text-white placeholder-zinc-800 tabular-nums"
              placeholder="0000.0"
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          </div>

          <div>
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1.5 ml-1">Poznámka / Cieľ</label>
            <input 
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/5 focus:border-white/20 rounded-xl outline-none transition-all text-xs text-zinc-300 font-medium placeholder-zinc-700"
              placeholder="Napríklad: Smer Bratislava..."
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button 
              type="submit"
              className="w-full py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg"
            >
              {activeTrip ? 'Uložiť a Uzatvoriť' : 'Zaznamenať Odchod'}
            </button>
            
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-1 text-zinc-600 text-[9px] font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Zrušiť
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;