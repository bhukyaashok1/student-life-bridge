
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
  const [initialized, setInitialized] = useState(false);

  // Hardcoded admin credentials
  const ADMIN_EMAIL = 'bhukyaashoknayak87@gmail.com';
  const ADMIN_PASSWORD = 'Ashoknayak7@';

  const createDefaultProfile = async (userId: string, userEmail: string) => {
    try {
      console.log('Creating default profile for user:', userId);
      
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: userEmail.split('@')[0], // Use email prefix as default name
          email: userEmail,
          phone: null,
          address: null,
          user_type: 'student'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating default profile:', profileError);
        return null;
      }

      console.log('Default profile created:', newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error in createDefaultProfile:', error);
      return null;
    }
  };

  const fetchUserData = async (userId: string, userEmail: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      // Fetch profile - use maybeSingle to handle missing profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      let currentProfile = profileData;

      // If no profile exists, create a default one
      if (!currentProfile) {
        console.log('No profile found, creating default profile...');
        currentProfile = await createDefaultProfile(userId, userEmail);
        
        if (!currentProfile) {
          console.error('Failed to create default profile');
          return;
        }
      }

      console.log('Profile data:', currentProfile);
      setProfile(currentProfile as StudentProfile);
      setUserType(currentProfile.user_type as 'student' | 'admin');

      // If student, fetch student data
      if (currentProfile.user_type === 'student') {
        console.log('Fetching student data for profile_id:', currentProfile.id);
        
        const { data: studentInfo, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', currentProfile.id)
          .maybeSingle();

        if (studentError) {
          console.error('Error fetching student data:', studentError);
          setStudentData(null);
          return;
        }

        if (!studentInfo) {
          console.log('No student record found for profile:', currentProfile.id);
          setStudentData(null);
          return;
        }

        console.log('Student data:', studentInfo);
        setStudentData(studentInfo);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    }
  };

  useEffect(() => {
    if (initialized) return;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Check for admin session first
        const adminSession = localStorage.getItem('admin_session');
        if (adminSession) {
          try {
            const { user: adminUser, profile: adminProfile } = JSON.parse(adminSession);
            setUser(adminUser);
            setProfile(adminProfile);
            setUserType('admin');
            setLoading(false);
            setInitialized(true);
            return;
          } catch (error) {
            console.error('Invalid admin session, removing:', error);
            localStorage.removeItem('admin_session');
          }
        }

        // Check for existing Supabase session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Current session:', currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          await fetchUserData(currentSession.user.id, currentSession.user.email || '');
        }
        
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [initialized]);

  useEffect(() => {
    if (!initialized) return;

    console.log('Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        // Skip if this is an admin session
        if (userType === 'admin') {
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          await fetchUserData(session.user.id, session.user.email || '');
        } else {
          setProfile(null);
          setStudentData(null);
          setUserType(null);
        }
      }
    );

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [initialized, userType]);

  const signUp = async (email: string, password: string, profileData: any, studentData: any) => {
    try {
      console.log('Starting signup process...');
      
      // Sign up the user without email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email_confirm: false // Disable email confirmation
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { error: authError };
      }

      if (!authData.user) {
        return { error: { message: 'Failed to create user' } };
      }

      console.log('User created successfully:', authData.user.id);

      // Wait a bit for user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create profile
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
        return { error: profileError };
      }

      console.log('Profile created successfully:', newProfile);

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

      console.log('Signup completed successfully');
      
      // Auto-sign in the user after successful signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('Auto sign-in error:', signInError);
        // Still return success since signup was successful
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      // Check if it's admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log('Admin login detected');
        
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

        console.log('Admin login successful');
        return { error: null };
      }

      // Regular student login
      console.log('Student login attempt');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Student login error:', error);
        return { error };
      }

      console.log('Student login successful');
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      
      // Clear admin session if exists
      localStorage.removeItem('admin_session');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Reset all state
      setUser(null);
      setSession(null);
      setProfile(null);
      setStudentData(null);
      setUserType(null);
      
      console.log('Sign out completed');
    } catch (error) {
      console.error('Sign out error:', error);
    }
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
