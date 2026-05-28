import { createClient } from '@supabase/supabase-js';
import { Pill, UserCheck, Calendar, FileText, AlertTriangle } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize bypass-RLS context safely using basic anon client targeting database RPC execution.
// Database function controls inner auth check rules.
const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

interface SharePageProps {
  params: {
    token: string;
  };
}

export default async function SharedMedicalReportPage({ params }: SharePageProps) {
  const { token } = params;

  // Query PostgreSQL secure definer function RPC
  const { data, error } = await supabaseServer.rpc('get_shared_medical_data', {
    share_token: token,
  });

  if (error || !data || data.error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center items-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl border border-rose-150 text-center space-y-4">
          <div className="mx-auto bg-rose-100 dark:bg-rose-950 text-rose-600 h-16 w-16 rounded-full flex justify-center items-center">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">Access Violation</h1>
          <p className="text-sm text-slate-500">
            {data?.error || 'The temporary access link supplied is invalid or expired. Ask the patient for an updated clinical token.'}
          </p>
        </div>
      </div>
    );
  }

  const { profile, medicines, doctor_visits, reports } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Verification Bar */}
        <div className="bg-emerald-650 text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">Authorized Medical Access</span>
            </div>
            <h1 className="text-2xl font-black mt-1">Clinical Portfolio: {profile?.full_name}</h1>
          </div>
          <div className="bg-emerald-700/50 px-4 py-2 rounded-xl text-xs font-semibold border border-emerald-500/20">
            Read-Only Verification active
          </div>
        </div>

        {/* Patient Core Summary Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-150 dark:border-slate-700 grid md:grid-cols-4 gap-6">
          <div>
            <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wide font-semibold">Blood Group</span>
            <p className="text-xl font-black text-slate-900 dark:text-white">{profile?.blood_group || 'Unknown'}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wide font-semibold font-mono">Critical Allergies</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile?.allergies && profile.allergies.length > 0 ? (
                profile.allergies.map((alg: string, idx: number) => (
                  <span key={idx} className="bg-rose-100 text-rose-800 text-xs px-2 py-0.5 rounded font-medium">{alg}</span>
                ))
              ) : (
                <span className="text-sm text-slate-400 font-medium">None Listed</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wide font-semibold">Chronic Conditions</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile?.chronic_diseases && profile.chronic_diseases.length > 0 ? (
                profile.chronic_diseases.map((dis: string, idx: number) => (
                  <span key={idx} className="bg-amber-100 text-amber-850 text-xs px-2 py-0.5 rounded font-medium">{dis}</span>
                ))
              ) : (
                <span className="text-sm text-slate-400 font-medium font-sans">No Chronic Diseases Listed</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wide font-semibold">Age Check</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {profile?.birth_date ? `${new Date().getFullYear() - new Date(profile.birth_date).getFullYear()} Years` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Current Treatment Schedule */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-150 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Pill className="text-emerald-500 h-5 w-5" /> Active Prescribed Medication Courses
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {medicines && medicines.length > 0 ? (
              medicines.map((med: any) => (
                <div key={med.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{med.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Dosage details: {med.dosage} - {med.frequency}</p>
                  <p className="text-xs text-slate-400 mt-2">Instruction window: {med.food_instructions} (Schedule: {med.timing?.join(', ')})</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 col-span-2 py-4">No active medicine records found on this account profile.</p>
            )}
          </div>
        </div>

        {/* Diagnostic Timeline Log */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-150 dark:border-slate-700 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-emerald-500" /> Professional Clinical Timeline & Visited Logs
          </h2>
          <div className="border-l-2 border-slate-150 dark:border-slate-700 pl-6 ml-3 space-y-6 relative">
            {doctor_visits && doctor_visits.length > 0 ? (
              doctor_visits.map((visit: any) => (
                <div key={visit.id} className="relative space-y-1">
                  {/* Timeline point */}
                  <span className="absolute -left-[31px] top-1.5 bg-emerald-600 border-4 border-white dark:border-slate-800 rounded-full h-4 w-4"></span>
                  <p className="text-xs text-slate-400 font-bold font-mono">{new Date(visit.visit_date).toLocaleDateString()}</p>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Dr. {visit.doctor_name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-650 block w-max">
                    {visit.hospital_name}
                  </span>
                  <p className="text-sm text-slate-650 dark:text-slate-300 mt-2">
                    <strong>Diagnosis:</strong> {visit.diagnosis || 'None entered'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap leading-relaxed">
                    <strong>Doctor notes:</strong> {visit.notes || 'None entered'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-4">No doctor records logged on this portfolio.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}