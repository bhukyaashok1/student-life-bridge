import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const { signIn, signUp, isAuthenticated, userType, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student-login');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const newErrors: Record<string, string> = {};
    if (!studentLoginData.email) newErrors.email = 'Email is required';
    if (!studentLoginData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdminLogin = () => {
    const newErrors: Record<string, string> = {};
    if (!adminLoginData.email) newErrors.email = 'Email is required';
    if (!adminLoginData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStudentSignup = () => {
    const newErrors: Record<string, string> = {};
    
    if (!studentSignupData.full_name) newErrors.full_name = 'Full name is required';
    if (!studentSignupData.email) newErrors.email = 'Email is required';
    if (!studentSignupData.password || studentSignupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (studentSignupData.password !== studentSignupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!studentSignupData.roll_number) newErrors.roll_number = 'Roll number is required';
    if (!studentSignupData.branch) newErrors.branch = 'Branch is required';
    if (!studentSignupData.section) newErrors.section = 'Section is required';
    if (!studentSignupData.year) newErrors.year = 'Year is required';
    if (!studentSignupData.semester) newErrors.semester = 'Semester is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStudentLogin()) return;

    setSubmitLoading(true);
    setErrors({});
    
    try {
      const { error } = await signIn(studentLoginData.email, studentLoginData.password);
      
      if (error) {
        setErrors({ submit: error.message });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAdminLogin()) return;

    setSubmitLoading(true);
    setErrors({});
    
    try {
      const { error } = await signIn(adminLoginData.email, adminLoginData.password);
      
      if (error) {
        setErrors({ submit: 'Invalid admin credentials' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStudentSignup()) return;

    setSubmitLoading(true);
    setErrors({});
    
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
      
      if (error) {
        setErrors({ submit: error.message });
      } else {
        // Success message - no email verification needed
        alert('Registration successful! You can now login with your credentials.');
        setActiveTab('student-login');
        // Pre-fill login form
        setStudentLoginData({
          email: studentSignupData.email,
          password: ''
        });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setSubmitLoading(false);
    }
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
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
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
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>
                
                {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                
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
                    {errors.full_name && <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>}
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
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
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
                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
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
                    {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
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
                    {errors.roll_number && <p className="text-sm text-red-600 mt-1">{errors.roll_number}</p>}
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
                    {errors.branch && <p className="text-sm text-red-600 mt-1">{errors.branch}</p>}
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
                    {errors.section && <p className="text-sm text-red-600 mt-1">{errors.section}</p>}
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
                    {errors.year && <p className="text-sm text-red-600 mt-1">{errors.year}</p>}
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
                    {errors.semester && <p className="text-sm text-red-600 mt-1">{errors.semester}</p>}
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
                
                {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                
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
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
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
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>
                
                {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                
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
