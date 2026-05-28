'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string;
  timing: string[];
  food_instructions: string;
  status: 'active' | 'completed' | 'missed';
  missed_doses: number;
}

export function useRealtimeMedicines(userId: string | undefined) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial state
    async function fetchMedicines() {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMedicines(data as Medicine[]);
      }
      setLoading(false);
    }

    fetchMedicines();

    // Setup realtime subscription
    const channel = supabase
      .channel(`medicines_user_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medicines',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMedicines((prev) => [payload.new as Medicine, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMedicines((prev) =>
              prev.map((item) => (item.id === payload.new.id ? (payload.new as Medicine) : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setMedicines((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { medicines, loading };
}