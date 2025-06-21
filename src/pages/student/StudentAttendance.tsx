
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = [
    { id: 'math', name: 'Mathematics', attended: 18, total: 20, percentage: 90 },
    { id: 'physics', name: 'Physics', attended: 16, total: 20, percentage: 80 },
    { id: 'chemistry', name: 'Chemistry', attended: 19, total: 20, percentage: 95 },
    { id: 'english', name: 'English', attended: 17, total: 20, percentage: 85 },
    { id: 'cs', name: 'Computer Science', attended: 20, total: 20, percentage: 100 },
  ];

  const recentAttendance = [
    { date: '2024-01-15', subject: 'Mathematics', status: 'Present' },
    { date: '2024-01-14', subject: 'Physics', status: 'Absent' },
    { date: '2024-01-13', subject: 'Chemistry', status: 'Present' },
    { date: '2024-01-12', subject: 'English', status: 'Present' },
    { date: '2024-01-11', subject: 'Computer Science', status: 'Present' },
  ];

  const overallAttendance = {
    totalClasses: 100,
    attendedClasses: 90,
    percentage: 90
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600">Track your class attendance and maintain good records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallAttendance.percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {overallAttendance.attendedClasses} of {overallAttendance.totalClasses} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance.attendedClasses}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance.totalClasses}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>Your attendance percentage for each subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{subject.name}</h4>
                    <p className="text-sm text-gray-600">
                      {subject.attended}/{subject.total} classes
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      subject.percentage >= 90 ? 'text-green-600' :
                      subject.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {subject.percentage}%
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          subject.percentage >= 90 ? 'bg-green-600' :
                          subject.percentage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${subject.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your attendance for the last 5 classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{record.subject}</p>
                    <p className="text-sm text-gray-600">{record.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.status === 'Present' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
