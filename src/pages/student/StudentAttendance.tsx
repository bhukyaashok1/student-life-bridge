
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';

interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  is_present: boolean;
}

interface SubjectAttendance {
  subject: string;
  attended: number;
  total: number;
  percentage: number;
}

export const StudentAttendance: React.FC = () => {
  const { studentData } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentData) {
      fetchAttendanceData();
    }
  }, [studentData]);

  const fetchAttendanceData = async () => {
    if (!studentData) return;

    try {
      setLoading(true);
      
      // Fetch attendance records for the student
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentData.id)
        .order('date', { ascending: false })
        .limit(10);

      if (attendanceError) {
        console.error('Error fetching attendance:', attendanceError);
        return;
      }

      console.log('Fetched attendance data:', attendanceData);
      setAttendanceRecords(attendanceData || []);

      // Calculate subject-wise attendance
      const subjectMap = new Map<string, { attended: number; total: number }>();
      
      (attendanceData || []).forEach(record => {
        if (!subjectMap.has(record.subject)) {
          subjectMap.set(record.subject, { attended: 0, total: 0 });
        }
        
        const subjectData = subjectMap.get(record.subject)!;
        subjectData.total++;
        if (record.is_present) {
          subjectData.attended++;
        }
      });

      const subjectAttendanceData: SubjectAttendance[] = Array.from(subjectMap.entries()).map(
        ([subject, data]) => ({
          subject,
          attended: data.attended,
          total: data.total,
          percentage: data.total > 0 ? Math.round((data.attended / data.total) * 100) : 0
        })
      );

      setSubjectAttendance(subjectAttendanceData);
    } catch (error) {
      console.error('Error in fetchAttendanceData:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Loading your attendance records...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Please complete your profile to view attendance</p>
        </div>
      </div>
    );
  }

  const overallAttendance = {
    totalClasses: attendanceRecords.length,
    attendedClasses: attendanceRecords.filter(record => record.is_present).length,
    percentage: attendanceRecords.length > 0 
      ? Math.round((attendanceRecords.filter(record => record.is_present).length / attendanceRecords.length) * 100)
      : 0
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
            <div className={`text-2xl font-bold ${
              overallAttendance.percentage >= 90 ? 'text-green-600' :
              overallAttendance.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {overallAttendance.percentage}%
            </div>
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
            {subjectAttendance.length > 0 ? (
              <div className="space-y-4">
                {subjectAttendance.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{subject.subject}</h4>
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
            ) : (
              <p className="text-gray-500 text-center">No attendance records found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your attendance for the last 10 classes</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceRecords.length > 0 ? (
              <div className="space-y-3">
                {attendanceRecords.slice(0, 10).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{record.subject}</p>
                      <p className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      record.is_present 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.is_present ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No recent attendance records</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
