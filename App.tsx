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
    if (!stored) return { fuelPrice: 1.65, averageConsumption: 6.5 };
    try {
      return JSON.parse(stored);
    } catch (e) {
      return { fuelPrice: 1.65, averageConsumption: 6.5 };
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
    const totalDistance = trips.reduce((acc, t) => acc + t.distanceKm, 0);
    const totalCost = trips.reduce((acc, t) => acc + t.totalCost, 0);
    const totalFuel = trips.reduce((acc, t) => acc + t.fuelConsumed, 0);
    return {
      totalDistance,
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
    <div className="min-h-screen bg-black flex flex-col text-zinc-100 selection:bg-white selection:text-black antialiased">
      <header className="bg-black/60 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white text-black rounded-lg flex items-center justify-center font-black text-[10px] shadow-lg shadow-white/5">K</div>
            <h1 className="text-[11px] font-black tracking-[0.2em] uppercase text-white/90">Kniha Jázd</h1>
          </div>
          <button 
            onClick={() => setView('settings')}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 text-zinc-500 hover:text-white group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-45 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto p-4 sm:p-6 mb-24">
        <div className="view-transition">
          {view === 'dashboard' && (
            <Dashboard 
              stats={stats} 
              recentTrips={trips.slice(0, 5)} 
              activeTrip={activeTrip}
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

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 py-3 px-8 gap-12 flex justify-center items-center rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
          <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1 transition-all ${view === 'dashboard' ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={view === 'dashboard' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[7px] uppercase font-black tracking-widest">Prehľad</span>
          </button>
          
          <button 
            onClick={() => view === 'add' ? setView('dashboard') : setView('add')} 
            className={`flex items-center justify-center w-12 h-12 scale-[1.01] rounded-full border-[6px] border-zinc-900 -mt-10 shadow-xl transition-all hover:scale-[1.05] active:scale-95 group ${view === 'add' ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${activeTrip || view === 'add' ? 'rotate-45' : 'group-hover:rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={(activeTrip || view === 'add') ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
            </svg>
          </button>

          <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 transition-all ${view === 'history' ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={view === 'history' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-[7px] uppercase font-black tracking-widest">Záznamy</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;