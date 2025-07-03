
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { CalendarDays, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { AttendanceChatbot } from '../../components/student/AttendanceChatbot';
import { SelfAttendanceMarker } from '../../components/student/SelfAttendanceMarker';
import { AttendanceCalculator } from '../../components/student/AttendanceCalculator';

interface AttendanceRecord {
  id: string;
  subject: string;
  date: string;
  is_present: boolean;
}

interface SubjectAttendance {
  subject: string;
  attended: number;
  total: number;
  percentage: number;
  classesToReach75: number;
  maxAbsences: number;
}

export const StudentAttendance: React.FC = () => {
  const { studentData, loading: authLoading } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    if (studentData && !authLoading) {
      fetchAttendanceData();
    }
  }, [studentData, authLoading]);

  const fetchAttendanceData = async () => {
    if (!studentData) return;

    try {
      setLoading(true);
      
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', studentData.profile_id)
        .maybeSingle();

      if (studentError) {
        console.error('Error fetching student record:', studentError);
        setError('Failed to fetch student data');
        return;
      }

      if (!studentRecord) {
        console.log('No student record found');
        setAttendance([]);
        setSubjectAttendance([]);
        setError(null);
        return;
      }

      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentRecord.id)
        .eq('semester', studentData.semester)
        .order('date', { ascending: false });

      if (attendanceError) {
        console.error('Error fetching attendance:', attendanceError);
        setError('Failed to fetch attendance data');
        return;
      }

      const attendanceRecords = attendanceData || [];
      setAttendance(attendanceRecords);

      // Calculate subject-wise attendance
      const subjectMap = new Map<string, { attended: number; total: number }>();
      
      attendanceRecords.forEach(record => {
        const current = subjectMap.get(record.subject) || { attended: 0, total: 0 };
        subjectMap.set(record.subject, {
          attended: current.attended + (record.is_present ? 1 : 0),
          total: current.total + 1
        });
      });

      const subjectAttendanceData: SubjectAttendance[] = Array.from(subjectMap.entries()).map(([subject, data]) => {
        const percentage = data.total > 0 ? (data.attended / data.total) * 100 : 0;
        const classesToReach75 = Math.max(0, Math.ceil((0.75 * data.total - data.attended) / 0.25));
        const maxAbsences = Math.max(0, Math.floor(data.attended / 3) - (data.total - data.attended));
        
        return {
          subject,
          attended: data.attended,
          total: data.total,
          percentage,
          classesToReach75,
          maxAbsences
        };
      });

      setSubjectAttendance(subjectAttendanceData);
      setError(null);
    } catch (error) {
      console.error('Error in fetchAttendanceData:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const overallAttendance = {
    totalClasses: attendance.length,
    attendedClasses: attendance.filter(record => record.is_present).length,
    percentage: attendance.length > 0 ? (attendance.filter(record => record.is_present).length / attendance.length) * 100 : 0
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 75) return { status: 'Good', color: 'bg-green-100 text-green-800' };
    if (percentage >= 65) return { status: 'Warning', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Critical', color: 'bg-red-100 text-red-800' };
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Loading your attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Unable to load student data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600">
          {studentData.branch} - Year {studentData.year}, Semester {studentData.semester}
        </p>
      </div>

      {/* Self Attendance Marker */}
      <SelfAttendanceMarker />

      {/* Attendance Calculator */}
      <AttendanceCalculator 
        subjectAttendance={subjectAttendance}
        overallAttendance={overallAttendance}
      />

      {/* Overall Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance.percentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {overallAttendance.attendedClasses}/{overallAttendance.totalClasses} classes
            </p>
            <Progress value={overallAttendance.percentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance.attendedClasses}</div>
            <p className="text-xs text-muted-foreground">Total present</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <CalendarDays className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance.totalClasses}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <Badge className={getAttendanceStatus(overallAttendance.percentage).color}>
              {getAttendanceStatus(overallAttendance.percentage).status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {overallAttendance.percentage >= 75 ? 'Meeting requirement' : 'Below 75% requirement'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Attendance */}
      {subjectAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>Detailed breakdown of your attendance in each subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Subject</th>
                    <th className="text-center p-2">Attended</th>
                    <th className="text-center p-2">Total</th>
                    <th className="text-center p-2">Percentage</th>
                    <th className="text-center p-2">Status</th>
                    <th className="text-center p-2">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectAttendance.map((subject) => {
                    const status = getAttendanceStatus(subject.percentage);
                    return (
                      <tr key={subject.subject} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{subject.subject}</td>
                        <td className="text-center p-2">{subject.attended}</td>
                        <td className="text-center p-2">{subject.total}</td>
                        <td className="text-center p-2 font-bold">{subject.percentage.toFixed(1)}%</td>
                        <td className="text-center p-2">
                          <Badge className={status.color}>
                            {status.status}
                          </Badge>
                        </td>
                        <td className="text-center p-2">
                          <Progress value={subject.percentage} className="w-20" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Requirements */}
      {subjectAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Requirements</CardTitle>
            <CardDescription>Analysis to help you maintain 75% attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700">Subjects Above 75%</h4>
                <div className="space-y-2">
                  {subjectAttendance
                    .filter(subject => subject.percentage >= 75)
                    .map(subject => (
                      <div key={subject.subject} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="font-medium">{subject.subject}</span>
                        <div className="text-right">
                          <span className="text-green-700 font-bold">{subject.percentage.toFixed(1)}%</span>
                          <p className="text-xs text-green-600">
                            Can miss {subject.maxAbsences} more classes
                          </p>
                        </div>
                      </div>
                    ))
                  }
                  {subjectAttendance.filter(subject => subject.percentage >= 75).length === 0 && (
                    <p className="text-gray-500 italic">No subjects above 75% yet</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-red-700">Subjects Below 75%</h4>
                <div className="space-y-2">
                  {subjectAttendance
                    .filter(subject => subject.percentage < 75)
                    .map(subject => (
                      <div key={subject.subject} className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="font-medium">{subject.subject}</span>
                        <div className="text-right">
                          <span className="text-red-700 font-bold">{subject.percentage.toFixed(1)}%</span>
                          <p className="text-xs text-red-600">
                            Need {subject.classesToReach75} more classes
                          </p>
                        </div>
                      </div>
                    ))
                  }
                  {subjectAttendance.filter(subject => subject.percentage < 75).length === 0 && (
                    <p className="text-gray-500 italic">Great! All subjects above 75%</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No attendance data message */}
      {attendance.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Attendance Records</CardTitle>
            <CardDescription>
              No attendance has been recorded for this semester yet. You can mark your attendance for today's classes above.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Attendance Chatbot */}
      {showChatbot && (
        <AttendanceChatbot
          studentData={studentData}
          subjectAttendance={subjectAttendance}
          overallAttendance={overallAttendance}
          onClose={() => setShowChatbot(false)}
        />
      )}

      {/* Chatbot trigger button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setShowChatbot(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <CalendarDays className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
