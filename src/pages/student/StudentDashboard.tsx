
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { Calendar, BookOpen, Award, Bell, FileText, Clock } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { profile, studentData } = useAuth();

  if (!profile || !studentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Current CGPA',
      value: studentData.cgpa.toString(),
      description: 'Overall performance',
      icon: Award,
      color: 'text-green-600',
    },
    {
      title: 'Current SGPA',
      value: studentData.sgpa.toString(),
      description: 'This semester',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      title: 'Year',
      value: studentData.year.toString(),
      description: `Semester ${studentData.semester}`,
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Branch',
      value: studentData.branch,
      description: `Section ${studentData.section}`,
      icon: FileText,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.full_name}!</h1>
        <p className="text-gray-600">Roll Number: {studentData.roll_number}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Latest updates and announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                <Bell className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Mid-term exam schedule released</p>
                  <p className="text-xs text-gray-500">Check your timetable for details</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                <FileText className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Assignment submission reminder</p>
                  <p className="text-xs text-gray-500">Due date: Tomorrow</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Library hours extended</p>
                  <p className="text-xs text-gray-500">Now open until 10 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your academic overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-sm text-green-600 font-semibold">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Assignments Completed</span>
                <span className="text-sm text-blue-600 font-semibold">12/15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-purple-600 font-semibold">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
