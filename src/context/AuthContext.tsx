
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

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
  checkUserExists: (email: string) => Promise<boolean>;
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

  const fetchUserData = async (userId: string, userEmail: string) => {
    try {
      console.log('Fetching user data for:', userId);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Error loading profile data');
        return;
      }

      if (!profileData) {
        console.error('No profile found for user:', userId);
        toast.error('Profile not found. Please contact support.');
        return;
      }

      console.log('Profile data:', profileData);
      setProfile(profileData as StudentProfile);
      setUserType(profileData.user_type as 'student' | 'admin');

      // If student, fetch student data
      if (profileData.user_type === 'student') {
        console.log('Fetching student data for profile_id:', profileData.id);
        
        const { data: studentInfo, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', profileData.id)
          .maybeSingle();

        if (studentError) {
          console.error('Error fetching student data:', studentError);
          toast.error('Error loading student data');
          setStudentData(null);
          return;
        }

        if (!studentInfo) {
          console.log('No student record found for profile:', profileData.id);
          setStudentData(null);
          return;
        }

        console.log('Student data:', studentInfo);
        setStudentData(studentInfo);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      toast.error('Unexpected error occurred while loading user data');
    }
  };

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error checking user existence:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkUserExists:', error);
      return false;
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
      
      // Check if user already exists
      const userExists = await checkUserExists(email);
      if (userExists) {
        toast.error('An account with this email already exists. Please try logging in.');
        return { error: { message: 'User already exists' } };
      }

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        toast.error(authError.message || 'Failed to create account');
        return { error: authError };
      }

      if (!authData.user) {
        toast.error('Failed to create user account');
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
        toast.error('Failed to create user profile');
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
        toast.error('Failed to create student record');
        return { error: studentError };
      }

      console.log('Signup completed successfully');
      toast.success('Account created successfully! You can now log in.');
      
      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred during signup');
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

        localStorage.setItem('admin_session', JSON.stringify({
          user: mockAdminUser,
          profile: mockAdminProfile
        }));

        console.log('Admin login successful');
        toast.success('Welcome, Admin!');
        return { error: null };
      }

      // For student login, first check if user exists in our database
      const userExists = await checkUserExists(email);
      if (!userExists) {
        toast.error('No account found with this email. Please sign up first.');
        return { error: { message: 'User not found' } };
      }

      // Regular student login
      console.log('Student login attempt');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Student login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else {
          toast.error(error.message || 'Login failed');
        }
        return { error };
      }

      console.log('Student login successful');
      toast.success('Login successful! Welcome back.');
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred during login');
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
      
      toast.success('Logged out successfully');
      console.log('Sign out completed');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error during logout');
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
    checkUserExists,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
