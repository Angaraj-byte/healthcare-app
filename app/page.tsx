import Link from 'next/link';
import { 
  Activity, 
  Shield, 
  Pill, 
  Bot, 
  ShieldAlert, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  Database
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-555 animate-pulse" />
            <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">AuraCare</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold hover:text-emerald-600 transition"
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-xs"
            >
              Register Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Shield className="h-3.5 w-3.5" /> HIPAA-Compliant Architecture
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-955 dark:text-white leading-tight tracking-tight">
              Your Complete Secure <span className="text-emerald-600">Personal Health</span> Ecosystem
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              Consolidate medical histories, automate medicine routines with realtime synchronization, safely share access tokens with emergency physicians, and evaluate critical symptoms.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/login"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold px-8 py-3.5 rounded-xl transition shadow-md flex justify-center items-center gap-2"
              >
                Enter Portal <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard/emergency"
                className="w-full sm:w-auto bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold px-8 py-3.5 rounded-xl transition flex justify-center items-center gap-2"
              >
                <ShieldAlert className="h-5 w-5" /> SOS Dispatch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Secured Medical Management
            </h2>
            <p className="text-sm text-slate-500">
              Four unified modules protecting and automating critical clinical data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature Card 1 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-750 space-y-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 rounded-xl w-max">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Timeline Records</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log doctor diagnostic metrics, hospital visits, notes, and store lab files securely behind Supabase Row Level Security.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-750 space-y-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 rounded-xl w-max">
                <Pill className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Realtime Medicine Tracker</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Automate dose timing and course intervals. Subscriptions automatically keep your dashboard updated in real-time.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-750 space-y-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 rounded-xl w-max">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">AI First-Aid Assistant</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Input conditions to get first-aid steps. Automatically highlights red warnings for severe situations.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-750 space-y-3">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-455 rounded-xl w-max">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">GPS SOS Dispatch</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get coordinates and find local trauma units. Logs accidents in database dispatch centers automatically.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="py-12 max-w-4xl mx-auto px-4 text-center">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 flex-wrap">
          <CheckCircle className="h-4 w-4 text-emerald-550" /> Built on secure Postgres RLS database protocols.
          <CheckCircle className="h-4 w-4 text-emerald-550" /> User profile separation ensured via JWT encryption keys.
        </p>
      </section>
    </div>
  );
}