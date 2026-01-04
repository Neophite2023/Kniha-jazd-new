import React, { useState } from 'react';
import { AppSettings, ServiceReminder } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave, onBack }) => {
  const [fuelPriceStr, setFuelPriceStr] = useState(settings.fuelPrice.toString());
  const [consumptionStr, setConsumptionStr] = useState(settings.averageConsumption.toString());
  const [reminders, setReminders] = useState<ServiceReminder[]>(settings.serviceReminders || []);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fuelPrice = parseFloat(fuelPriceStr.replace(',', '.'));
    const averageConsumption = parseFloat(consumptionStr.replace(',', '.'));

    if (isNaN(fuelPrice) || isNaN(averageConsumption)) return;
    onSave({
      fuelPrice,
      averageConsumption,
      serviceReminders: reminders
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addReminder = () => {
    const newReminder: ServiceReminder = {
      id: Date.now().toString(),
      name: '',
      interval: 15000,
      lastServiceOdometer: 0
    };
    setReminders([...reminders, newReminder]);
  };

  const updateReminder = (id: string, field: keyof ServiceReminder, value: any) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
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
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Servisné Pripomienky</h3>
            <button
              type="button"
              onClick={addReminder}
              className="text-xs font-bold text-zinc-950 px-3 py-1 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
            >
              + Pridať
            </button>
          </div>

          <div className="space-y-3">
            {reminders.length === 0 ? (
              <div className="px-4 py-8 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
                <p className="text-xs font-medium text-zinc-400 uppercase">Žiadne pripomienky</p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div key={reminder.id} className="bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-sm relative group">
                  <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
                    <input
                      type="text"
                      value={reminder.name}
                      onChange={e => updateReminder(reminder.id, 'name', e.target.value)}
                      className="flex-grow bg-transparent text-sm font-bold text-zinc-950 placeholder-zinc-300 outline-none"
                      placeholder="Názov (napr. Olej)"
                    />
                    <button
                      type="button"
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-1 text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 border-b border-zinc-100 flex items-center gap-4">
                    <label className="w-40 text-xs font-semibold text-zinc-500 uppercase">Interval</label>
                    <input
                      type="number"
                      value={reminder.interval}
                      onChange={e => updateReminder(reminder.id, 'interval', parseInt(e.target.value) || 0)}
                      className="flex-grow bg-transparent text-sm font-medium text-zinc-950 text-right tabular-nums outline-none"
                    />
                    <span className="text-[10px] font-bold text-zinc-300">km</span>
                  </div>
                  <div className="p-4 flex items-center gap-4">
                    <label className="w-40 text-xs font-semibold text-zinc-500 uppercase">Posledný servis</label>
                    <input
                      type="number"
                      value={reminder.lastServiceOdometer}
                      onChange={e => updateReminder(reminder.id, 'lastServiceOdometer', parseInt(e.target.value) || 0)}
                      className="flex-grow bg-transparent text-sm font-medium text-zinc-950 text-right tabular-nums outline-none"
                    />
                    <span className="text-[10px] font-bold text-zinc-300">ODO</span>
                  </div>
                </div>
              ))
            )}
          </div>
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
        <div className="text-[8px] text-zinc-200 font-bold uppercase tracking-[0.2em] mt-1">Version 1.3.0 • 2026</div>
      </div>
    </div>
  );
};

export default Settings;