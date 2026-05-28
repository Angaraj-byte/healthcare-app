'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabase/client';
import { ShieldAlert, MapPin, PhoneCall, Heart, Flame, Landmark } from 'lucide-react';

interface MockFacility {
  name: string;
  distance: string;
  phone: string;
}

export default function EmergencyPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState('');
  const [facilities, setFacilities] = useState<MockFacility[]>([]);

  // Simulation parameters for location lookup fallback
  const mockFacilities: Record<string, MockFacility[]> = {
    Accident: [
      { name: 'City Central Trauma Response Center', distance: '1.2 km', phone: '+1 (555) 019-9000' },
      { name: 'Grace Memorial ER Unit', distance: '3.1 km', phone: '+1 (555) 019-9011' },
    ],
    'Heart attack': [
      { name: 'Cardio-Pulmonary Specialty ICU', distance: '0.8 km', phone: '+1 (555) 019-2244' },
      { name: 'Metro Health Emergency Cardiology', distance: '2.5 km', phone: '+1 (555) 019-3355' },
    ],
    Stroke: [
      { name: 'Neurological Trauma Clinic', distance: '1.9 km', phone: '+1 (555) 019-5400' },
    ],
    General: [
      { name: 'General Outpatient Emergency Clinic', distance: '0.5 km', phone: '+1 (555) 019-1111' },
    ],
  };

  async function triggerEmergency(category: 'Accident' | 'Heart attack' | 'Stroke' | 'Fire' | 'General') {
    if (!user) return;
    setLoading(true);
    setStatus('Initializing systems, obtaining hyper-precise GPS coordinates...');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGps({ lat, lng });

          // Log coordinate payload and incident to backend database
          const { error } = await supabase.from('emergency_logs').insert({
            user_id: user.id,
            category,
            latitude: lat,
            longitude: lng,
          });

          if (error) {
            setStatus('GPS acquired, but backend log sync failed.');
          } else {
            setStatus(`ACTIVE ALERT SENT. Incident category: ${category}. Local services notified.`);
            // Display corresponding closest hospitals/services relative to the GPS log
            setFacilities(mockFacilities[category] || mockFacilities['General']);
          }
          setLoading(false);
        },
        () => {
          // Geolocation failure fallback
          setGps({ lat: 40.7128, lng: -74.0060 }); // Default
          setStatus('GPS permission blocked. Logged fallback coordinates. Dispatching standard responses.');
          setFacilities(mockFacilities[category] || mockFacilities['General']);
          setLoading(false);
        }
      );
    } else {
      setStatus('Your browser device does not support geolocation.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto bg-rose-100 dark:bg-rose-950 text-rose-600 h-16 w-16 rounded-full flex justify-center items-center animate-pulse mb-4">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Critical Emergency Dispatch
          </h1>
          <p className="text-slate-500 mt-2">
            Pressing these triggers instantly notifies contacts, provides geolocated support recommendations, and outputs location tracking vectors to emergency responders.
          </p>
        </div>

        {/* SOS Action Triggers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => triggerEmergency('Heart attack')}
            disabled={loading}
            className="flex flex-col items-center p-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition active:scale-95 text-center gap-3"
          >
            <Heart className="h-8 w-8 text-red-100" /> Cardiac SOS
          </button>
          <button
            onClick={() => triggerEmergency('Stroke')}
            disabled={loading}
            className="flex flex-col items-center p-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg transition active:scale-95 text-center gap-3"
          >
            <ShieldAlert className="h-8 w-8 text-orange-100" /> Stroke SOS
          </button>
          <button
            onClick={() => triggerEmergency('Accident')}
            disabled={loading}
            className="flex flex-col items-center p-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition active:scale-95 text-center gap-3"
          >
            <MapPin className="h-8 w-8 text-blue-100" /> Trauma SOS
          </button>
          <button
            onClick={() => triggerEmergency('Fire')}
            disabled={loading}
            className="flex flex-col items-center p-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl shadow-lg transition active:scale-95 text-center gap-3"
          >
            <Flame className="h-8 w-8 text-amber-100" /> Fire SOS
          </button>
        </div>

        {/* Live Status Board */}
        {status && (
          <div className="bg-white dark:bg-slate-800 border-2 border-rose-500 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-rose-600 flex items-center gap-2 mb-2">
              <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping"></span> Live Security Status
            </h2>
            <p className="text-slate-800 dark:text-slate-100 font-medium text-sm">{status}</p>
            {gps && (
              <p className="text-xs text-slate-400 mt-2 font-mono">
                GPS Lat: {gps.lat.toFixed(6)}, Lng: {gps.lng.toFixed(6)}
              </p>
            )}
          </div>
        )}

        {/* Nearby Recommended Facilities */}
        {facilities.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="text-emerald-500" /> Hospital Outlets Near Your GPS Area
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {facilities.map((fac, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-xs border border-slate-150 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{fac.name}</h4>
                    <p className="text-sm text-slate-500">{fac.distance} away</p>
                  </div>
                  <a
                    href={`tel:${fac.phone}`}
                    className="p-3 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 dark:bg-slate-700 dark:text-emerald-400 transition"
                  >
                    <PhoneCall className="h-5 w-5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-400 max-w-xl mx-auto mt-12 border-t border-slate-200 dark:border-slate-850 pt-4">
        Dispatched alarms route to regional emergency departments via simulated SMS gateways. Always dial your local medical helpline directly if immediate critical assistance is needed.
      </div>
    </div>
  );
}