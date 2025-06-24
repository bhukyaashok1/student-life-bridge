
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const LoginForm: React.FC = () => {
  const { signIn, signUp, checkUserExists, isAuthenticated, userType, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student-login');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [attemptedEmail, setAttemptedEmail] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'student') {
        navigate('/student/dashboard');
      }
    }
  }, [isAuthenticated, userType, loading, navigate]);

  // Student login form
  const [studentLoginData, setStudentLoginData] = useState({
    email: '',
    password: ''
  });

  // Admin login form
  const [adminLoginData, setAdminLoginData] = useState({
    email: '',
    password: ''
  });

  // Student signup form
  const [studentSignupData, setStudentSignupData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    roll_number: '',
    branch: '',
    section: '',
    year: 1,
    semester: 1,
    sgpa: 0,
    cgpa: 0
  });

  const validateStudentLogin = () => {
    if (!studentLoginData.email) {
      toast.error('Email is required');
      return false;
    }
    if (!studentLoginData.password) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  const validateAdminLogin = () => {
    if (!adminLoginData.email) {
      toast.error('Email is required');
      return false;
    }
    if (!adminLoginData.password) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  const validateStudentSignup = () => {
    if (!studentSignupData.full_name) {
      toast.error('Full name is required');
      return false;
    }
    if (!studentSignupData.email) {
      toast.error('Email is required');
      return false;
    }
    if (!studentSignupData.password || studentSignupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (studentSignupData.password !== studentSignupData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!studentSignupData.roll_number) {
      toast.error('Roll number is required');
      return false;
    }
    if (!studentSignupData.branch) {
      toast.error('Branch is required');
      return false;
    }
    if (!studentSignupData.section) {
      toast.error('Section is required');
      return false;
    }
    if (!studentSignupData.year) {
      toast.error('Year is required');
      return false;
    }
    if (!studentSignupData.semester) {
      toast.error('Semester is required');
      return false;
    }
    return true;
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStudentLogin()) return;

    setSubmitLoading(true);
    setShowSignupPrompt(false);
    
    try {
      const { error } = await signIn(studentLoginData.email, studentLoginData.password);
      
      if (error) {
        if (error.message === 'User not found') {
          setAttemptedEmail(studentLoginData.email);
          setShowSignupPrompt(true);
        }
        // Toast error is already shown in signIn function
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAdminLogin()) return;

    setSubmitLoading(true);
    
    try {
      const { error } = await signIn(adminLoginData.email, adminLoginData.password);
      
      if (error) {
        // Toast error is already shown in signIn function
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStudentSignup()) return;

    setSubmitLoading(true);
    
    try {
      const profileData = {
        full_name: studentSignupData.full_name,
        email: studentSignupData.email,
        phone: studentSignupData.phone,
        address: studentSignupData.address
      };

      const academicData = {
        roll_number: studentSignupData.roll_number,
        branch: studentSignupData.branch,
        section: studentSignupData.section,
        year: studentSignupData.year,
        semester: studentSignupData.semester,
        sgpa: studentSignupData.sgpa,
        cgpa: studentSignupData.cgpa
      };

      const { error } = await signUp(
        studentSignupData.email,
        studentSignupData.password,
        profileData,
        academicData
      );
      
      if (!error) {
        // Switch to login tab and pre-fill email
        setActiveTab('student-login');
        setStudentLoginData({
          email: studentSignupData.email,
          password: ''
        });
        setShowSignupPrompt(false);
        
        // Reset signup form
        setStudentSignupData({
          full_name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          address: '',
          roll_number: '',
          branch: '',
          section: '',
          year: 1,
          semester: 1,
          sgpa: 0,
          cgpa: 0
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSignupPromptAction = () => {
    setActiveTab('student-signup');
    setStudentSignupData(prev => ({
      ...prev,
      email: attemptedEmail
    }));
    setShowSignupPrompt(false);
  };

  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Student Connect</CardTitle>
          <CardDescription className="text-center">
            Access your student portal or admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSignupPrompt && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Account Not Found</h3>
              <p className="text-yellow-700 mb-3">
                No account exists for <strong>{attemptedEmail}</strong>. Would you like to create a new account?
              </p>
              <div className="flex space-x-3">
                <Button 
                  onClick={handleSignupPromptAction}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSignupPrompt(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student-login">Student Login</TabsTrigger>
              <TabsTrigger value="student-signup">Student Signup</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student-login">
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div>
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    value={studentLoginData.email}
                    onChange={(e) => setStudentLoginData({ ...studentLoginData, email: e.target.value })}
                    placeholder="Enter your email"
                    disabled={submitLoading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="student-password">Password</Label>
                  <Input
                    id="student-password"
                    type="password"
                    value={studentLoginData.password}
                    onChange={(e) => setStudentLoginData({ ...studentLoginData, password: e.target.value })}
                    placeholder="Enter your password"
                    disabled={submitLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={submitLoading}>
                  {submitLoading ? 'Signing In...' : 'Sign In as Student'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="student-signup">
              <form onSubmit={handleStudentSignup} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input
                      id="full-name"
                      value={studentSignupData.full_name}
                      onChange={(e) => setStudentSignupData({ ...studentSignupData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      disabled={submitLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={studentSignupData.email}
                      onChange={(e) => setStudentSignupData({ ...studentSignupData, email: e.target.value })}
                      placeholder="Enter your email"
                      disabled={submitLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={studentSignupData.password}
                      onChange={(e) => setStudentSignupData({ ...studentSignupData, password: e.target.value })}
                      placeholder="Enter your password"
                      disabled={submitLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={studentSignupData.confirmPassword}
                      onChange={(e) => setStudentSignupData({ ...studentSignupData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      disabled={submitLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={studentSignupData.phone}
                      onChange={(e) => setStudentSignupData({ ...studentSignupData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      disabled={submitLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="roll-number">Roll Number</Label>
                    <Input
                      id="roll-number"
                      value={studentSignupData.roll_number}
                      onChange={(e) => setStudentSignupData({ ...studentSignupData, roll_number: e.target.value })}
                      placeholder="Enter your roll number"
                      disabled={submitLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Select 
                      value={studentSignupData.branch} 
                      onValueChange={(value) => setStudentSignupData({ ...studentSignupData, branch: value })}
                      disabled={submitLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="section">Section</Label>
                    <Select 
                      value={studentSignupData.section} 
                      onValueChange={(value) => setStudentSignupData({ ...studentSignupData, section: value })}
                      disabled={submitLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Section A</SelectItem>
                        <SelectItem value="B">Section B</SelectItem>
                        <SelectItem value="C">Section C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Select 
                      value={studentSignupData.year.toString()} 
                      onValueChange={(value) => setStudentSignupData({ ...studentSignupData, year: parseInt(value) })}
                      disabled={submitLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Year 1</SelectItem>
                        <SelectItem value="2">Year 2</SelectItem>
                        <SelectItem value="3">Year 3</SelectItem>
                        <SelectItem value="4">Year 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select 
                      value={studentSignupData.semester.toString()} 
                      onValueChange={(value) => setStudentSignupData({ ...studentSignupData, semester: parseInt(value) })}
                      disabled={submitLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                        <SelectItem value="3">Semester 3</SelectItem>
                        <SelectItem value="4">Semester 4</SelectItem>
                        <SelectItem value="5">Semester 5</SelectItem>
                        <SelectItem value="6">Semester 6</SelectItem>
                        <SelectItem value="7">Semester 7</SelectItem>
                        <SelectItem value="8">Semester 8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={studentSignupData.address}
                    onChange={(e) => setStudentSignupData({ ...studentSignupData, address: e.target.value })}
                    placeholder="Enter your address"
                    disabled={submitLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={submitLoading}>
                  {submitLoading ? 'Creating Account...' : 'Create Student Account'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={adminLoginData.email}
                    onChange={(e) => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
                    placeholder="Enter admin email"
                    disabled={submitLoading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminLoginData.password}
                    onChange={(e) => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
                    placeholder="Enter admin password"
                    disabled={submitLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={submitLoading}>
                  {submitLoading ? 'Signing In...' : 'Sign In as Admin'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
