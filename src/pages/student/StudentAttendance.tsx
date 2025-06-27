import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Calendar, Clock, TrendingUp, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { AttendanceChatbot } from '../../components/student/AttendanceChatbot';

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
  classesToReach75: number;
  maxAbsences: number;
}

interface TimetableEntry {
  id: string;
  day_of_week: string;
  time_slot: string;
  subject: string;
}

export const StudentAttendance: React.FC = () => {
  const { studentData, loading: authLoading } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
  const [currentClasses, setCurrentClasses] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    if (studentData && !authLoading) {
      fetchData();
      const interval = setInterval(checkCurrentClasses, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [studentData, authLoading]);

  const fetchData = async () => {
    if (!studentData) return;

    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchAttendanceData(),
        fetchTimetableData()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    if (!studentData) return;

    const { data: attendanceData, error: attendanceError } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentData.id)
      .order('date', { ascending: false });

    if (attendanceError) {
      console.error('Error fetching attendance:', attendanceError);
      return;
    }

    const records = attendanceData || [];
    setAttendanceRecords(records);
    calculateSubjectAttendance(records);
  };

  const fetchTimetableData = async () => {
    if (!studentData) return;

    const { data, error } = await supabase
      .from('timetables')
      .select('*')
      .eq('branch', studentData.branch)
      .eq('year', studentData.year)
      .eq('semester', studentData.semester)
      .eq('section', studentData.section);

    if (error) {
      console.error('Error fetching timetable:', error);
      return;
    }

    setTimetableData(data || []);
    checkCurrentClasses(data || []);
  };

  const checkCurrentClasses = (timetable = timetableData) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayClasses = timetable.filter(entry => entry.day_of_week === currentDay);
    
    const activeClasses = todayClasses.filter(entry => {
      const [startTime] = entry.time_slot.split('-');
      const [hours, minutes] = startTime.split(':').map(Number);
      const classTime = hours * 100 + minutes;
      const classEndTime = classTime + 100; // Assuming 1-hour classes
      
      return currentTime >= classTime && currentTime <= classEndTime;
    });

    setCurrentClasses(activeClasses);
  };

  const calculateSubjectAttendance = (records: AttendanceRecord[]) => {
    const subjectMap = new Map<string, { attended: number; total: number }>();
    
    records.forEach(record => {
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
      ([subject, data]) => {
        const percentage = data.total > 0 ? Math.round((data.attended / data.total) * 100) : 0;
        
        // Calculate classes needed to reach 75%
        const classesToReach75 = Math.max(0, Math.ceil((0.75 * data.total - data.attended) / 0.25));
        
        // Calculate maximum absences while maintaining 75%
        const maxAbsences = Math.floor(data.total * 0.25);

        return {
          subject,
          attended: data.attended,
          total: data.total,
          percentage,
          classesToReach75,
          maxAbsences
        };
      }
    );

    setSubjectAttendance(subjectAttendanceData);
  };

  const markAttendance = async (classEntry: TimetableEntry, isPresent: boolean) => {
    if (!studentData) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('attendance')
        .insert({
          student_id: studentData.id,
          date: today,
          subject: classEntry.subject,
          branch: studentData.branch,
          year: studentData.year,
          semester: studentData.semester,
          section: studentData.section,
          is_present: isPresent
        });

      if (error) {
        console.error('Error marking attendance:', error);
        return;
      }

      // Refresh data
      await fetchAttendanceData();
    } catch (error) {
      console.error('Error in markAttendance:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Loading your attendance records...</p>
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
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
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

  const overallAttendance = {
    totalClasses: attendanceRecords.length,
    attendedClasses: attendanceRecords.filter(record => record.is_present).length,
    percentage: attendanceRecords.length > 0 
      ? Math.round((attendanceRecords.filter(record => record.is_present).length / attendanceRecords.length) * 100)
      : 0
  };

  const totalClassesToReach75 = subjectAttendance.reduce((sum, subject) => sum + subject.classesToReach75, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track your class attendance and maintain good records</p>
        </div>
        <Button
          onClick={() => setShowChatbot(!showChatbot)}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Attendance Helper
        </Button>
      </div>

      {/* Current Classes - Mark Attendance */}
      {currentClasses.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Current Classes - Mark Attendance</CardTitle>
            <CardDescription>You can mark attendance for these ongoing classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentClasses.map((classEntry) => (
                <div key={classEntry.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <h4 className="font-medium">{classEntry.subject}</h4>
                    <p className="text-sm text-gray-600">{classEntry.time_slot}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => markAttendance(classEntry, true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAttendance(classEntry, false)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Absent
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm font-medium">Classes to 75%</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalClassesToReach75}</div>
            <p className="text-xs text-muted-foreground">More classes needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
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
            <CardTitle>Subject-wise Attendance Analysis</CardTitle>
            <CardDescription>Detailed breakdown with 75% target analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {subjectAttendance.length > 0 ? (
              <div className="space-y-4">
                {subjectAttendance.map((subject) => (
                  <div key={subject.subject} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{subject.subject}</h4>
                      <div className={`text-lg font-bold ${
                        subject.percentage >= 90 ? 'text-green-600' :
                        subject.percentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {subject.percentage}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Attended: {subject.attended}/{subject.total}</p>
                        {subject.classesToReach75 > 0 && (
                          <p className="text-blue-600">Need {subject.classesToReach75} more to reach 75%</p>
                        )}
                      </div>
                      <div>
                        <p className="text-gray-600">Max absences: {subject.maxAbsences}</p>
                        {subject.percentage >= 75 && (
                          <p className="text-green-600">Target achieved! ✓</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            subject.percentage >= 90 ? 'bg-green-600' :
                            subject.percentage >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${Math.min(subject.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No attendance records found</p>
                <p className="text-sm text-gray-400 mt-2">Your attendance will appear here once classes begin</p>
              </div>
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
              <div className="text-center py-8">
                <p className="text-gray-500">No recent attendance records</p>
                <p className="text-sm text-gray-400 mt-2">Your recent attendance will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showChatbot && (
        <AttendanceChatbot 
          studentData={studentData}
          subjectAttendance={subjectAttendance}
          overallAttendance={overallAttendance}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </div>
  );
};
