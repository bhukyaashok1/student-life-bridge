
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  user_type: 'student' | 'admin';
}

interface StudentData {
  id: string;
  profile_id: string;
  roll_number: string;
  branch: string;
  section: string;
  year: number;
  semester: number;
  sgpa: number;
  cgpa: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: StudentProfile | null;
  studentData: StudentData | null;
  userType: 'student' | 'admin' | null;
  signUp: (email: string, password: string, profileData: any, studentData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded admin credentials
  const ADMIN_EMAIL = 'bhukyaashoknayak87@gmail.com';
  const ADMIN_PASSWORD = 'Ashoknayak7@';

  useEffect(() => {
    // Check for admin session on load
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession && !user) {
      try {
        const { user: adminUser, profile: adminProfile } = JSON.parse(adminSession);
        setUser(adminUser);
        setProfile(adminProfile);
        setUserType('admin');
        setLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem('admin_session');
      }
    }

    // Set up auth state listener for regular users
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile and student data
          await fetchUserData(session.user.id);
        } else {
          setProfile(null);
          setStudentData(null);
          setUserType(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [user]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      setProfile(profileData as StudentProfile);
      setUserType(profileData.user_type as 'student' | 'admin');

      // If student, fetch student data
      if (profileData.user_type === 'student') {
        const { data: studentInfo, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', profileData.id)
          .single();

        if (studentError) {
          console.error('Error fetching student data:', studentError);
        } else {
          setStudentData(studentInfo);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    }
  };

  const signUp = async (email: string, password: string, profileData: any, studentData: any) => {
    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { error: authError };
      }

      if (!authData.user) {
        return { error: { message: 'Failed to create user' } };
      }

      // Wait a moment for the user to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create profile using the service role (bypass RLS)
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone || null,
          address: profileData.address || null,
          user_type: 'student'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        return { error: profileError };
      }

      // Create student data
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          profile_id: newProfile.id,
          roll_number: studentData.roll_number,
          branch: studentData.branch,
          section: studentData.section,
          year: studentData.year,
          semester: studentData.semester,
          sgpa: studentData.sgpa || 0.00,
          cgpa: studentData.cgpa || 0.00
        });

      if (studentError) {
        console.error('Student data creation error:', studentError);
        return { error: studentError };
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Check if it's admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a mock admin session
      const mockAdminUser = {
        id: 'admin-user-id',
        email: ADMIN_EMAIL,
        user_metadata: { user_type: 'admin' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User;

      const mockAdminProfile = {
        id: 'admin-profile-id',
        user_id: 'admin-user-id',
        full_name: 'Admin User',
        email: ADMIN_EMAIL,
        user_type: 'admin' as const
      };

      setUser(mockAdminUser);
      setProfile(mockAdminProfile);
      setUserType('admin');
      setStudentData(null);
      
      // Store admin session in localStorage
      localStorage.setItem('admin_session', JSON.stringify({
        user: mockAdminUser,
        profile: mockAdminProfile
      }));

      return { error: null };
    }

    // Regular student login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return { error };

    return { error: null };
  };

  const signOut = async () => {
    // Clear admin session if exists
    localStorage.removeItem('admin_session');
    
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    setUser(null);
    setSession(null);
    setProfile(null);
    setStudentData(null);
    setUserType(null);
  };

  const value = {
    user,
    session,
    profile,
    studentData,
    userType,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
