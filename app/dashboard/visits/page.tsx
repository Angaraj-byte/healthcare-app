'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabase/client';
import { ClipboardList, Copy, Link, Check, Clock } from 'lucide-react';

export default function ShareMedicalHistory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [duration, setDuration] = useState('24'); // default 24 hours

  async function generateToken() {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const expiryTime = new Date(now.getTime() + parseInt(duration) * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('shared_links')
      .insert({
        user_id: user.id,
        expires_at: expiryTime.toISOString(),
      })
      .select('token')
      .single();

    if (!error && data) {
      const origin = window.location.origin;
      setShareUrl(`${origin}/share/${data.token}`);
    }
    setLoading(false);
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-150 dark:border-slate-700 max-w-xl">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
        <Link className="text-emerald-500 h-5 w-5" /> Generate Clinical Access Link
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Generate an encrypted, read-only link containing your clinical history timelines, diagnosis, and active medicines to present to emergency physicians.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
            <Clock className="h-4 w-4 text-slate-400" /> Token Validation Window
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 bg-transparent text-slate-900 dark:text-white"
          >
            <option value="1">1 Hour</option>
            <option value="12">12 Hours</option>
            <option value="24">24 Hours (1 Day)</option>
            <option value="168">168 Hours (7 Days)</option>
          </select>
        </div>

        <button
          onClick={generateToken}
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg py-3 font-semibold transition"
        >
          {loading ? 'Creating Secure Path...' : 'Create Secure Read-Only Access Token'}
        </button>

        {shareUrl && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 space-y-2">
            <span className="block text-xs font-bold text-emerald-600 uppercase tracking-widest">Access Token Generated</span>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-150 dark:border-slate-700">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-grow bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-300 transition"
                title="Copy secure link"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-550" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              This token expires precisely {duration} hours from generation, revoking access automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}