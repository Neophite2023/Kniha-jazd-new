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
  const [serviceIntervalStr, setServiceIntervalStr] = useState(settings.serviceInterval?.toString() || '15000');
  const [lastServiceOdoStr, setLastServiceOdoStr] = useState(settings.lastServiceOdometer?.toString() || '0');
  const [serviceNameStr, setServiceNameStr] = useState(settings.serviceName || 'Servisná prehliadka');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fuelPrice = parseFloat(fuelPriceStr.replace(',', '.'));
    const averageConsumption = parseFloat(consumptionStr.replace(',', '.'));
    const serviceInterval = parseInt(serviceIntervalStr);
    const lastServiceOdometer = parseInt(lastServiceOdoStr);

    if (isNaN(fuelPrice) || isNaN(averageConsumption)) return;
    onSave({
      fuelPrice,
      averageConsumption,
      serviceInterval: isNaN(serviceInterval) ? undefined : serviceInterval,
      lastServiceOdometer: isNaN(lastServiceOdometer) ? undefined : lastServiceOdometer,
      serviceName: serviceNameStr || 'Servisná prehliadka'
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <form onSubmit={handleSave} className="space-y-8">
        <div className="space-y-2">
          <h3 className="px-4 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Konfigurácia cien a spotreby</h3>
          <div className="bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-sm">
            <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
              <label className="w-40 text-sm font-semibold text-zinc-900">Cena paliva</label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={fuelPriceStr}
                onChange={e => setFuelPriceStr(e.target.value)}
                className="flex-grow bg-transparent text-sm font-medium text-zinc-950 placeholder-zinc-300 outline-none text-right tabular-nums"
                placeholder="0.00"
              />
              <span className="text-xs font-semibold text-zinc-400">€ / L</span>
            </div>
            <div className="p-4 flex items-center gap-4">
              <label className="w-40 text-sm font-semibold text-zinc-900">Ø Spotreba</label>
              <input
                type="text"
                inputMode="decimal"
                required
                value={consumptionStr}
                onChange={e => setConsumptionStr(e.target.value)}
                className="flex-grow bg-transparent text-sm font-medium text-zinc-950 placeholder-zinc-300 outline-none text-right tabular-nums"
                placeholder="0.0"
              />
              <span className="text-xs font-semibold text-zinc-400">L / 100km</span>
            </div>
          </div>
          <p className="px-4 text-[10px] text-zinc-400 font-medium">Tieto údaje sa používajú na automatický prepočet nákladov na každú jazdu.</p>
        </div>

        <div className="space-y-2">
          <h3 className="px-4 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Servisná Pripomienka</h3>
          <div className="bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-sm">
            <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
              <label className="w-40 text-sm font-semibold text-zinc-900">Názov intervalu</label>
              <input
                type="text"
                value={serviceNameStr}
                onChange={e => setServiceNameStr(e.target.value)}
                className="flex-grow bg-transparent text-sm font-medium text-zinc-950 placeholder-zinc-300 outline-none text-right"
                placeholder="Napr. Výmena oleja"
              />
            </div>
            <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
              <label className="w-40 text-sm font-semibold text-zinc-900">Servisný interval</label>
              <input
                type="number"
                inputMode="numeric"
                value={serviceIntervalStr}
                onChange={e => setServiceIntervalStr(e.target.value)}
                className="flex-grow bg-transparent text-sm font-medium text-zinc-950 placeholder-zinc-300 outline-none text-right tabular-nums"
                placeholder="15000"
              />
              <span className="text-xs font-semibold text-zinc-400">km</span>
            </div>
            <div className="p-4 flex items-center gap-4">
              <label className="w-40 text-sm font-semibold text-zinc-900">Posledný servis</label>
              <input
                type="number"
                inputMode="numeric"
                value={lastServiceOdoStr}
                onChange={e => setLastServiceOdoStr(e.target.value)}
                className="flex-grow bg-transparent text-sm font-medium text-zinc-950 placeholder-zinc-300 outline-none text-right tabular-nums"
                placeholder="0"
              />
              <span className="text-xs font-semibold text-zinc-400">odo</span>
            </div>
          </div>
          <p className="px-4 text-[10px] text-zinc-400 font-medium">Najazdené km od posledného servisu sa vypočítajú automaticky.</p>
        </div>

        <div className="space-y-4 px-2">
          <button
            type="submit"
            disabled={isSaved}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] shadow-lg ${isSaved ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-950 text-white shadow-zinc-200'}`}
          >
            {isSaved ? 'Uložené' : 'Uložiť zmeny'}
          </button>
        </div>
      </form>

      <div className="mt-12 text-center">
        <div className="text-[10px] text-zinc-300 font-bold uppercase tracking-[0.4em]">Kniha Jázd Pro</div>
        <div className="text-[8px] text-zinc-200 font-bold uppercase tracking-[0.2em] mt-1">Version 1.2.0 • 2026</div>
      </div>
    </div>
  );
};

export default Settings;