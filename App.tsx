import React, { useState, useEffect, useMemo } from 'react';
import { Trip, AppSettings, HistoryStats, ActiveTrip } from './types';
import TripForm from './components/TripForm';
import TripList from './components/TripList';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';

const STORAGE_KEY_TRIPS = 'kniha_jazd_trips_v1';
const STORAGE_KEY_SETTINGS = 'kniha_jazd_settings_v1';
const STORAGE_KEY_ACTIVE = 'kniha_jazd_active_v1';

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_TRIPS);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!stored) return { fuelPrice: 1.65, averageConsumption: 6.5, serviceInterval: 15000, lastServiceOdometer: 0, serviceName: 'Výmena oleja' };
    try {
      const parsed = JSON.parse(stored);
      return {
        fuelPrice: 1.65,
        averageConsumption: 6.5,
        serviceInterval: 15000,
        lastServiceOdometer: 0,
        serviceName: 'Výmena oleja',
        ...parsed
      };
    } catch (e) {
      return { fuelPrice: 1.65, averageConsumption: 6.5, serviceInterval: 15000, lastServiceOdometer: 0, serviceName: 'Výmena oleja' };
    }
  });

  const [view, setView] = useState<'dashboard' | 'add' | 'history' | 'settings'>('dashboard');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (activeTrip) {
      localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(activeTrip));
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
    }
  }, [activeTrip]);

  const stats: HistoryStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalDistance = trips.reduce((acc, t) => acc + t.distanceKm, 0);
    const totalCost = trips.reduce((acc, t) => acc + t.totalCost, 0);
    const totalFuel = trips.reduce((acc, t) => acc + t.fuelConsumed, 0);

    const monthlyTrips = trips.filter(t => {
      const tripDate = new Date(t.date);
      return tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear;
    });
    const monthlyDistance = monthlyTrips.reduce((acc, t) => acc + t.distanceKm, 0);

    const monthName = now.toLocaleDateString('sk-SK', { month: 'long' });

    return {
      totalDistance,
      monthlyDistance,
      currentMonthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      currentYear,
      totalCost,
      totalFuel,
      averageTripDistance: trips.length > 0 ? totalDistance / trips.length : 0,
    };
  }, [trips]);

  const handleSaveTrip = (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
    setActiveTrip(null);
    setView('dashboard');
  };

  const handleStartTrip = (trip: ActiveTrip) => {
    setActiveTrip(trip);
    setView('dashboard');
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(current => current.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col text-zinc-950 selection:bg-zinc-900/10 antialiased overflow-x-hidden relative">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold tracking-tight">Kniha Jázd</h1>
        <button
          onClick={() => setView('settings')}
          className="p-2 -mr-2 text-zinc-900 hover:opacity-60 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </header>

      <main className="flex-grow w-full max-w-lg mx-auto p-4 pb-32">
        <div className="mb-8 px-2 pt-6">
          <h2 className="text-4xl font-extrabold tracking-tight">
            {view === 'dashboard' ? 'Prehľad' : view === 'add' ? 'Záznam' : view === 'history' ? 'História' : 'Nastavenia'}
          </h2>
        </div>

        <div className="view-transition">
          {view === 'dashboard' && (
            <Dashboard
              stats={stats}
              recentTrips={trips.slice(0, 5)}
              activeTrip={activeTrip}
              settings={settings}
              lastOdometer={trips.length > 0 ? trips[0].endOdometer : 0}
              onViewAll={() => setView('history')}
              onAddTrip={() => setView('add')}
            />
          )}
          {view === 'add' && (
            <TripForm
              key={activeTrip ? 'active' : 'new'}
              settings={settings}
              activeTrip={activeTrip}
              onStart={handleStartTrip}
              onSave={handleSaveTrip}
              onCancel={() => setView('dashboard')}
              lastTripEndOdometer={trips.length > 0 ? trips[0].endOdometer : 0}
            />
          )}
          {view === 'history' && (
            <TripList
              trips={trips}
              onDelete={handleDeleteTrip}
              onBack={() => setView('dashboard')}
            />
          )}
          {view === 'settings' && (
            <Settings
              settings={settings}
              onSave={setSettings}
              onBack={() => setView('dashboard')}
            />
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-3xl border-t border-zinc-200 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-lg mx-auto flex justify-between items-center h-16 px-12">
          <button
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${view === 'dashboard' ? 'text-zinc-950' : 'text-zinc-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px]" fill={view === 'dashboard' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-medium">Prehľad</span>
          </button>

          <button
            onClick={() => view === 'add' ? setView('dashboard') : setView('add')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${view === 'add' ? 'text-zinc-950' : 'text-zinc-400'}`}
          >
            <div className={`p-1.5 rounded-full shadow-lg transition-transform active:scale-95 ${view === 'add' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900 border border-zinc-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => setView('history')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${view === 'history' ? 'text-zinc-950' : 'text-zinc-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px]" fill={view === 'history' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-medium">História</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;