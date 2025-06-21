
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student-login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    // Personal details
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    // Academic details
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
    
    // Personal details validation
    if (!studentSignupData.full_name) newErrors.full_name = 'Full name is required';
    if (!studentSignupData.email) newErrors.email = 'Email is required';
    if (!studentSignupData.password || studentSignupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (studentSignupData.password !== studentSignupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Academic details validation
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

    setLoading(true);
    const { error } = await signIn(studentLoginData.email, studentLoginData.password);
    
    if (error) {
      setErrors({ submit: error.message });
    } else {
      navigate('/student/dashboard');
    }
    setLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAdminLogin()) return;

    setLoading(true);
    const { error } = await signIn(adminLoginData.email, adminLoginData.password);
    
    if (error) {
      setErrors({ submit: 'Invalid admin credentials' });
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStudentSignup()) return;

    setLoading(true);
    
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
      alert('Registration successful! Please check your email to verify your account.');
      setActiveTab('student-login');
    }
    setLoading(false);
  };

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
                  />
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>
                
                {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In as Student'}
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
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="roll-number">Roll Number</Label>
                    <Input
                      id="roll-number"
                      value={studentSignupData.roll_number}
                      onChange={(e) => setStudentSignupData({ ...studentSignupData, roll_number: e.target.value })}
                      placeholder="Enter your roll number"
                    />
                    {errors.roll_number && <p className="text-sm text-red-600 mt-1">{errors.roll_number}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Select value={studentSignupData.branch} onValueChange={(value) => setStudentSignupData({ ...studentSignupData, branch: value })}>
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
                    <Select value={studentSignupData.section} onValueChange={(value) => setStudentSignupData({ ...studentSignupData, section: value })}>
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
                    <Select value={studentSignupData.year.toString()} onValueChange={(value) => setStudentSignupData({ ...studentSignupData, year: parseInt(value) })}>
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
                    <Select value={studentSignupData.semester.toString()} onValueChange={(value) => setStudentSignupData({ ...studentSignupData, semester: parseInt(value) })}>
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
                  />
                </div>
                
                {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Student Account'}
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
                  />
                  {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                </div>
                
                {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In as Admin'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
