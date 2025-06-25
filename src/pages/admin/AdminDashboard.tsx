
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Calendar, GraduationCap, Bell, FileText, MessageSquare } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

interface DashboardStats {
  totalStudents: number;
  averageAttendance: number;
  averageCGPA: number;
  pendingFeedback: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    averageAttendance: 0,
    averageCGPA: 0,
    pendingFeedback: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, cgpa');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      }

      // Fetch attendance data for the current month
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('is_present')
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0]);

      if (attendanceError) {
        console.error('Error fetching attendance:', attendanceError);
      }

      // Calculate stats
      const totalStudents = studentsData?.length || 0;
      const averageCGPA = totalStudents > 0 
        ? studentsData.reduce((sum, student) => sum + (student.cgpa || 0), 0) / totalStudents 
        : 0;

      const totalAttendanceRecords = attendanceData?.length || 0;
      const presentRecords = attendanceData?.filter(record => record.is_present).length || 0;
      const averageAttendance = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

      setStats({
        totalStudents,
        averageAttendance: Math.round(averageAttendance),
        averageCGPA: Math.round(averageCGPA * 10) / 10,
        pendingFeedback: Math.floor(totalStudents * 0.1) // Placeholder calculation
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Students',
      value: loading ? '...' : stats.totalStudents.toString(),
      description: 'Active students',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Average Attendance',
      value: loading ? '...' : `${stats.averageAttendance}%`,
      description: 'This month',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Average CGPA',
      value: loading ? '...' : stats.averageCGPA.toString(),
      description: 'All students',
      icon: GraduationCap,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Feedback',
      value: loading ? '...' : stats.pendingFeedback.toString(),
      description: 'Needs attention',
      icon: MessageSquare,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of college management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
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
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                <Bell className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">New notification sent</p>
                  <p className="text-xs text-gray-500">Mid-term exam schedule</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                <Users className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Student registered</p>
                  <p className="text-xs text-gray-500">John Smith - CS Dept</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded">
                <FileText className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Question paper uploaded</p>
                  <p className="text-xs text-gray-500">Mathematics - Semester 5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Quick statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-sm text-green-600 font-semibold">
                  {loading ? '...' : `${stats.averageAttendance}%`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${stats.averageAttendance}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Assignment Submissions</span>
                <span className="text-sm text-blue-600 font-semibold">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Student Satisfaction</span>
                <span className="text-sm text-purple-600 font-semibold">4.2/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
