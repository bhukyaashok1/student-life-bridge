
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';
import { Calendar, GraduationCap, BookOpen, Bell } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const student = user as Student;

  const stats = [
    {
      title: 'Overall Attendance',
      value: '85%',
      description: 'Current semester',
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Current SGPA',
      value: student?.sgpa || '8.5',
      description: 'Semester 5',
      icon: GraduationCap,
      color: 'text-green-600',
    },
    {
      title: 'CGPA',
      value: student?.cgpa || '8.2',
      description: 'Overall',
      icon: BookOpen,
      color: 'text-purple-600',
    },
    {
      title: 'Notifications',
      value: '3',
      description: 'Unread',
      icon: Bell,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {student?.name}!</p>
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
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Math', 'Physics', 'Chemistry', 'English'].map((subject) => (
                <div key={subject} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{subject}</span>
                  <span className="text-green-600 font-semibold">Present</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Mid-term Exam - Mathematics</h4>
                <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">Assignment Submission - Physics</h4>
                <p className="text-sm text-gray-600">Friday, 5:00 PM</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold">Cultural Event</h4>
                <p className="text-sm text-gray-600">Next Monday, 2:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
