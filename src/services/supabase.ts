import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mssrjizsazszangvoeze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zc3JqaXpzYXpzemFuZ3ZvZXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzI0NzcsImV4cCI6MjA1MTI0ODQ3N30.ukBhZUgGIjw6_5L0_rDUTYoC_PhJoXoe1WHLduFL84I';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Database helpers
export const getRides = async () => {
  const { data, error } = await supabase
    .from('rides')
    .select('*');
  if (error) throw error;
  return data;
};

export const createRide = async (rideData: any) => {
  const { data, error } = await supabase
    .from('rides')
    .insert([rideData])
    .select();
  if (error) throw error;
  return data;
};

export const updateRideStatus = async (rideId: string, status: string) => {
  const { data, error } = await supabase
    .from('rides')
    .update({ status })
    .eq('id', rideId)
    .select();
  if (error) throw error;
  return data;
};

// Real-time subscriptions
export const subscribeToRides = (callback: (payload: any) => void) => {
  return supabase
    .channel('rides')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, callback)
    .subscribe();
};
