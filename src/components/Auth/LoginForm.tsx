
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [studentData, setStudentData] = useState({ rollNumber: '', password: '' });
  const [adminData, setAdminData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStudent = () => {
    const newErrors: Record<string, string> = {};
    if (!studentData.rollNumber) newErrors.rollNumber = 'Roll number is required';
    if (!studentData.password || studentData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdmin = () => {
    const newErrors: Record<string, string> = {};
    if (!adminData.email || !adminData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }
    if (!adminData.password || adminData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStudent()) {
      const mockStudent = {
        id: '1',
        name: 'John Doe',
        rollNumber: studentData.rollNumber,
        branch: 'Computer Science',
        section: 'A',
        year: 3,
        semester: 5,
        contactInfo: {
          email: 'john.doe@college.edu',
          phone: '+1234567890',
          address: '123 College Street'
        },
        sgpa: 8.5,
        cgpa: 8.2
      };
      
      login(mockStudent, 'student');
      navigate('/student/dashboard');
    }
  };

  const onAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAdmin()) {
      const mockAdmin = {
        id: '1',
        name: 'Admin User',
        email: adminData.email,
        role: 'admin' as const
      };
      
      login(mockAdmin, 'admin');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="student">
              <form onSubmit={onStudentSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    value={studentData.rollNumber}
                    onChange={(e) => setStudentData({ ...studentData, rollNumber: e.target.value })}
                    placeholder="Enter your roll number"
                  />
                  {errors.rollNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.rollNumber}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={studentData.password}
                    onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full">
                  Sign In as Student
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={onAdminSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={adminData.email}
                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="adminPassword">Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminData.password}
                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full">
                  Sign In as Admin
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
