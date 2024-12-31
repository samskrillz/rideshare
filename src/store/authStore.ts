import create from 'zustand';
import { supabase } from '../services/supabase';

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  setSession: (session: any) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ session: data.session, user: data.user });
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});
