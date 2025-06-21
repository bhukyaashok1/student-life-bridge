
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const studentLoginSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type StudentLoginForm = z.infer<typeof studentLoginSchema>;
type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');

  const studentForm = useForm<StudentLoginForm>({
    resolver: zodResolver(studentLoginSchema),
  });

  const adminForm = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onStudentSubmit = (data: StudentLoginForm) => {
    // Mock student login
    const mockStudent = {
      id: '1',
      name: 'John Doe',
      rollNumber: data.rollNumber,
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
  };

  const onAdminSubmit = (data: AdminLoginForm) => {
    // Mock admin login
    const mockAdmin = {
      id: '1',
      name: 'Admin User',
      email: data.email,
      role: 'admin' as const
    };
    
    login(mockAdmin, 'admin');
    navigate('/admin/dashboard');
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
              <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    {...studentForm.register('rollNumber')}
                    placeholder="Enter your roll number"
                  />
                  {studentForm.formState.errors.rollNumber && (
                    <p className="text-sm text-red-600 mt-1">
                      {studentForm.formState.errors.rollNumber.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...studentForm.register('password')}
                    placeholder="Enter your password"
                  />
                  {studentForm.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {studentForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                
                <Button type="submit" className="w-full">
                  Sign In as Student
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...adminForm.register('email')}
                    placeholder="Enter your email"
                  />
                  {adminForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {adminForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="adminPassword">Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    {...adminForm.register('password')}
                    placeholder="Enter your password"
                  />
                  {adminForm.formState.errors.password && (
                    <p className="text-sm text-red-600 mt-1">
                      {adminForm.formState.errors.password.message}
                    </p>
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
