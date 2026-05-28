'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeMedicines, Medicine } from '@/hooks/useRealtimeMedicines';
import { supabase } from '@/utils/supabase/client';
import { Pill, Plus, CheckCircle2, AlertTriangle, Trash2, Calendar } from 'lucide-react';

export default function MedicinesPage() {
  const { user } = useAuth();
  const { medicines, loading } = useRealtimeMedicines(user?.id);

  // Form State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timing, setTiming] = useState<string[]>([]);
  const [foodInstructions, setFoodInstructions] = useState('After food');

  async function handleAddMedicine(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from('medicines').insert({
      user_id: user.id,
      name,
      dosage,
      frequency,
      start_date: startDate,
      end_date: endDate,
      timing,
      food_instructions: foodInstructions,
      status: 'active',
    });

    if (!error) {
      // Clear values on success
      setName('');
      setDosage('');
      setTiming([]);
    }
  }

  async function updateStatus(id: string, newStatus: 'active' | 'completed' | 'missed') {
    await supabase.from('medicines').update({ status: newStatus }).eq('id', id);
  }

  async function deleteMedicine(id: string) {
    await supabase.from('medicines').delete().eq('id', id);
  }

  const handleTimingCheckbox = (time: string) => {
    setTiming((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Medicine Entry Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-150 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Pill className="text-emerald-500 h-5 w-5" /> Add New Medicine
          </h2>
          <form onSubmit={handleAddMedicine} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medicine Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white focus:outline-emerald-500"
                placeholder="e.g. Paracetamol"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dosage</label>
                <input
                  type="text"
                  required
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white"
                  placeholder="e.g. 500mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white"
                >
                  <option value="Daily">Daily</option>
                  <option value="Twice Daily">Twice Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Timing</span>
              <div className="flex gap-4">
                {['morning', 'afternoon', 'night'].map((time) => (
                  <label key={time} className="inline-flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 capitalize">
                    <input
                      type="checkbox"
                      checked={timing.includes(time)}
                      onChange={() => handleTimingCheckbox(time)}
                      className="rounded border-slate-300 dark:border-slate-600 accent-emerald-500"
                    />
                    {time}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Food Instructions</label>
              <select
                value={foodInstructions}
                onChange={(e) => setFoodInstructions(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white"
              >
                <option value="After food">After food</option>
                <option value="Before food">Before food</option>
                <option value="With food">With food</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 font-semibold transition flex justify-center items-center gap-2 shadow-sm"
            >
              <Plus h-4 w-4 /> Schedule Medicine
            </button>
          </form>
        </div>

        {/* Current Treatment Courses (Realtime UI List) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Active Treatment Programs</h1>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs rounded-full font-semibold">
              Real-time Active
            </span>
          </div>

          {medicines.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 p-8 text-center rounded-2xl border border-slate-150 dark:border-slate-700">
              <Pill className="mx-auto text-slate-300 dark:text-slate-600 h-12 w-12 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No active medicines logged. Add one to start tracking!</p>
            </div>
          ) : (
            medicines.map((med) => (
              <div
                key={med.id}
                className={`p-5 rounded-2xl shadow-sm bg-white dark:bg-slate-800 border transition-colors ${
                  med.status === 'completed'
                    ? 'border-emerald-250 dark:border-emerald-900'
                    : 'border-slate-150 dark:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-slate-700 rounded-xl text-emerald-600 dark:text-emerald-400">
                      <Pill className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {med.name} <span className="text-sm font-normal text-slate-500">({med.dosage})</span>
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3.5 w-3.5" /> Course: {med.start_date} to {med.end_date}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-full">
                          {med.frequency}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-full capitalize">
                          Timings: {med.timing.join(', ')}
                        </span>
                        <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-250 text-xs rounded-full">
                          {med.food_instructions}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {med.status === 'active' && (
                      <>
                        <button
                          onClick={() => updateStatus(med.id, 'completed')}
                          title="Complete course"
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg dark:hover:bg-slate-700 transition"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => updateStatus(med.id, 'missed')}
                          title="Missed dosage alert"
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg dark:hover:bg-slate-700 transition"
                        >
                          <AlertTriangle className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteMedicine(med.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}