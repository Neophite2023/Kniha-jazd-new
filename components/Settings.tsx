import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onBack }) => {
  const [fuelPriceStr, setFuelPriceStr] = useState(settings.fuelPrice.toString());
  const [consumptionStr, setConsumptionStr] = useState(settings.averageConsumption.toString());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fuelPrice = parseFloat(fuelPriceStr.replace(',', '.'));
    const averageConsumption = parseFloat(consumptionStr.replace(',', '.'));
    if (isNaN(fuelPrice) || isNaN(averageConsumption)) return;
    onSave({ fuelPrice, averageConsumption });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-zinc-950 hover:bg-zinc-900 rounded border border-white/5 transition-all text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-base font-bold text-white tracking-widest uppercase">Nastavenia</h2>
      </div>

      <div className="bg-black p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2 ml-1">Cena (€ / L)</label>
              <div className="relative">
                <input 
                  type="text" 
                  inputMode="decimal"
                  required
                  value={fuelPriceStr}
                  onChange={e => setFuelPriceStr(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 outline-none transition-all text-xl font-bold text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-2 ml-1">Ø Spotreba (L/100km)</label>
              <div className="relative">
                <input 
                  type="text" 
                  inputMode="decimal"
                  required
                  value={consumptionStr}
                  onChange={e => setConsumptionStr(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 focus:border-white py-2 outline-none transition-all text-xl font-bold text-white"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-4 rounded font-bold text-[9px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${isSaved ? 'bg-zinc-800 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
          >
            {isSaved ? 'Uložené' : 'Uložiť'}
          </button>
        </form>
      </div>

      <div className="mt-10 text-center text-zinc-800 font-bold text-[8px] uppercase tracking-[0.6em]">
        Kniha Jázd • 2025
      </div>
    </div>
  );
};

export default Settings;