'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabase/client';
import { useRealtimeMedicines, Medicine } from '@/hooks/useRealtimeMedicines';
import {
  User,
  Heart,
  Pill,
  Calendar,
  AlertTriangle,
  Clock,
  Phone,
  PlusCircle,
  FileText,
  Activity,
  ArrowRight,
  ShieldAlert,
  Edit2
} from 'lucide-react';
import Link from 'next/link';

interface DoctorVisit {
  id: string;
  doctor_name: string;
  hospital_name: string;
  visit_date: string;
  diagnosis: string;
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const { medicines, loading: medLoading } = useRealtimeMedicines(user?.id);
  
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [visitsLoading, setVisitsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile Form States
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [chronicInput, setChronicInput] = useState('');
  const [phone, setPhone] = useState('');

  // Fetch recent doctor visits
  useEffect(() => {
    if (!user) return;
    
    // Capture user.id as a stable, non-null constant for the async closure
    const userId = user.id;

    async function fetchRecentVisits() {
      const { data, error } = await supabase
        .from('doctor_visits')
        .select('id, doctor_name, hospital_name, visit_date, diagnosis')
        .eq('user_id', userId)
        .order('visit_date', { ascending: false })
        .limit(3);

      if (!error && data) {
        setVisits(data as DoctorVisit[]);
      }
      setVisitsLoading(false);
    }

    fetchRecentVisits();
  }, [user]);

  // Load profile values into inputs when modal opens
  useEffect(() => {
    if (profile) {
      setBloodGroup(profile.blood_group || 'Unknown');
      setAllergiesInput(profile.allergies?.join(', ') || '');
      setChronicInput(profile.chronic_diseases?.join(', ') || '');
    }
  }, [profile]);

  // Handle Profile Update
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const userId = user.id; // Local copy to protect typescript type check
    const allergiesArr = allergiesInput.split(',').map((item) => item.trim()).filter(Boolean);
    const chronicArr = chronicInput.split(',').map((item) => item.trim()).filter(Boolean);

    const { error } = await supabase
      .from('profiles')
      .update({
        blood_group: bloodGroup,
        allergies: allergiesArr,
        chronic_diseases: chronicArr,
      })
      .eq('id', userId);

    if (!error) {
      await refreshProfile();
      setIsEditingProfile(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 dark:bg-slate-900 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Access Unauthorized</h2>
          <p className="text-slate-500">Please sign in to access your secure medical dashboard.</p>
          <Link
            href="/login"
            className="inline-block bg-emerald-650 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
      {/* Navigation Top-Bar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-150 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-500" />
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">AuraCare Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/emergency"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition tracking-wide flex items-center gap-1"
            >
              <ShieldAlert className="h-4 w-4" /> SOS EMERGENCY
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-955 dark:text-white">
              Welcome back, {profile?.full_name || 'Patient'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your patient health credentials and emergency profiles are active and secure.
            </p>
          </div>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-655 text-slate-800 dark:text-slate-200 rounded-xl transition"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit Health Info
          </button>
        </div>

        {/* Essential Health Metrics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blood group card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700 shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Blood Group</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {profile?.blood_group || 'Unknown'}
                </p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-2xl">
                <Heart className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Allergies Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700 shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Logged Allergies</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profile?.allergies && profile.allergies.length > 0 ? (
                    profile.allergies.map((alg, index) => (
                      <span key={index} className="bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-350 text-xs px-2.5 py-1 rounded-lg font-semibold">
                        {alg}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400 italic">No recorded allergies</span>
                  )}
                </div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-2xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Chronic Diseases Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700 shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Chronic Conditions</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profile?.chronic_diseases && profile.chronic_diseases.length > 0 ? (
                    profile.chronic_diseases.map((cond, index) => (
                      <span key={index} className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs px-2.5 py-1 rounded-lg font-semibold">
                        {cond}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400 italic">No chronic diseases listed</span>
                  )}
                </div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Medicines Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="text-emerald-500 h-5 w-5" /> Current Medicines
              </h2>
              <Link href="/dashboard/medicines" className="text-xs text-emerald-650 hover:underline flex items-center gap-1 font-semibold">
                Manage Tracker <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {medLoading ? (
              <p className="text-sm text-slate-400">Loading medicines...</p>
            ) : medicines.length === 0 ? (
              <p className="text-sm text-slate-450 italic py-4">No active medications scheduled today.</p>
            ) : (
              <div className="space-y-3">
                {medicines.slice(0, 3).map((med: Medicine) => (
                  <div key={med.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{med.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{med.dosage} - {med.food_instructions}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 capitalize">
                      {med.timing.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Doctor Visits Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-150 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="text-emerald-500 h-5 w-5" /> Recent Doctor Visits
              </h2>
              <Link href="/dashboard/visits" className="text-xs text-emerald-650 hover:underline flex items-center gap-1 font-semibold">
                View History <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {visitsLoading ? (
              <p className="text-sm text-slate-400">Loading visit history...</p>
            ) : visits.length === 0 ? (
              <p className="text-sm text-slate-450 italic py-4">No doctor visits recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {visits.map((visit) => (
                  <div key={visit.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Dr. {visit.doctor_name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{visit.hospital_name} — {visit.diagnosis || 'General checkup'}</p>
                    </div>
                    <span className="text-xs text-slate-450 font-mono">
                      {new Date(visit.visit_date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Feature Navigation Directory Shortcut Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/assistant"
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 dark:border-slate-700 hover:border-emerald-450 transition text-center space-y-2 group"
          >
            <Activity className="h-6 w-6 text-emerald-500 mx-auto group-hover:scale-110 transition" />
            <span className="block font-bold text-slate-800 dark:text-white text-sm">AI Guidance</span>
          </Link>
          <Link
            href="/dashboard/medicines"
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 dark:border-slate-700 hover:border-emerald-450 transition text-center space-y-2 group"
          >
            <Pill className="h-6 w-6 text-emerald-500 mx-auto group-hover:scale-110 transition" />
            <span className="block font-bold text-slate-800 dark:text-white text-sm">Med Tracker</span>
          </Link>
          <Link
            href="/dashboard/visits"
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 dark:border-slate-700 hover:border-emerald-450 transition text-center space-y-2 group"
          >
            <Calendar className="h-6 w-6 text-emerald-500 mx-auto group-hover:scale-110 transition" />
            <span className="block font-bold text-slate-800 dark:text-white text-sm">Doctor Visits</span>
          </Link>
          <Link
            href="/dashboard/emergency"
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 dark:border-slate-700 hover:border-rose-450 transition text-center space-y-2 group"
          >
            <ShieldAlert className="h-6 w-6 text-rose-500 mx-auto group-hover:scale-110 transition" />
            <span className="block font-bold text-slate-800 dark:text-white text-sm">Emergency SOS</span>
          </Link>
        </div>

      </main>

      {/* Edit Health Profile Dialog Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Medical Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white mt-1"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Allergies (comma-separated)</label>
                <input
                  type="text"
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white mt-1 text-sm"
                  placeholder="e.g. Penicillin, Peanuts"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Chronic Diseases (comma-separated)</label>
                <input
                  type="text"
                  value={chronicInput}
                  onChange={(e) => setChronicInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white mt-1 text-sm"
                  placeholder="e.g. Asthma, Hypertension"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-800 dark:text-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}