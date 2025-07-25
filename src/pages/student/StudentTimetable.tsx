
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Clock, Calendar, TrendingUp, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TimetableEntry {
  id: string;
  day_of_week: string;
  time_slot: string;
  subject: string;
}

interface AttendanceData {
  subject: string;
  attended: number;
  total: number;
  percentage: number;
}

export const StudentTimetable: React.FC = () => {
  const { studentData, loading: authLoading } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [timetableData, setTimetableData] = useState<Record<string, TimetableEntry[]>>({});
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fixed time slots based on year
  const getTimeSlotsForYear = (year: number): string[] => {
    if (year === 1) {
      return ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-12:40', '12:40-01:40', '01:40-02:40', '02:40-03:40'];
    } else {
      return ['10:00-11:00', '11:00-12:00', '12:00-01:00', '01:00-01:40', '01:40-02:40', '02:40-03:40', '03:40-04:40'];
    }
  };

  const isLunchSlot = (timeSlot: string): boolean => {
    return timeSlot === '12:00-12:40' || timeSlot === '01:00-01:40';
  };

  useEffect(() => {
    if (studentData && !authLoading) {
      const fixedTimeSlots = getTimeSlotsForYear(studentData.year);
      setTimeSlots(fixedTimeSlots);
      fetchTimetable();
      fetchAttendanceData();
    }
  }, [studentData, authLoading]);

  const fetchTimetable = async () => {
    if (!studentData) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching timetable for:', {
        branch: studentData.branch,
        year: studentData.year,
        semester: studentData.semester,
        section: studentData.section
      });

      const { data, error: fetchError } = await supabase
        .rpc('get_timetable_for_class', {
          p_branch: studentData.branch,
          p_year: studentData.year,
          p_semester: studentData.semester,
          p_section: studentData.section
        });

      if (fetchError) {
        console.error('Error fetching timetable:', fetchError);
        setError('Failed to fetch timetable data');
        return;
      }

      console.log('Fetched timetable data:', data);

      // Group by day
      const groupedData: Record<string, TimetableEntry[]> = {};
      days.forEach(day => {
        groupedData[day] = data?.filter(item => item.day_of_week === day) || [];
      });

      setTimetableData(groupedData);
    } catch (error) {
      console.error('Error in fetchTimetable:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceData = async () => {
    if (!studentData) return;

    try {
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', studentData.profile_id)
        .single();

      if (studentError || !studentRecord) {
        console.error('Error fetching student record:', studentError);
        return;
      }

      const { data: attendanceRecords, error: attendanceError } = await supabase
        .from('attendance')
        .select('subject, is_present')
        .eq('student_id', studentRecord.id);

      if (attendanceError) {
        console.error('Error fetching attendance:', attendanceError);
        return;
      }

      // Calculate attendance by subject
      const subjectAttendance: Record<string, { attended: number; total: number }> = {};
      
      attendanceRecords?.forEach(record => {
        if (!subjectAttendance[record.subject]) {
          subjectAttendance[record.subject] = { attended: 0, total: 0 };
        }
        subjectAttendance[record.subject].total++;
        if (record.is_present) {
          subjectAttendance[record.subject].attended++;
        }
      });

      const attendanceData = Object.entries(subjectAttendance).map(([subject, data]) => ({
        subject,
        attended: data.attended,
        total: data.total,
        percentage: data.total > 0 ? Math.round((data.attended / data.total) * 100) : 0
      }));

      setAttendanceData(attendanceData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Physics': 'bg-green-100 text-green-800 border-green-200',
      'Chemistry': 'bg-purple-100 text-purple-800 border-purple-200',
      'English': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Programming': 'bg-red-100 text-red-800 border-red-200',
      'Computer Science': 'bg-red-100 text-red-800 border-red-200',
      'Data Structures': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Algorithms': 'bg-pink-100 text-pink-800 border-pink-200',
      'Database Systems': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Operating Systems': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTodaysClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return timetableData[today]?.length || 0;
  };

  const getNextClass = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = timetableData[today] || [];
    return todayClasses.length > 0 ? todayClasses[0] : null;
  };

  const overallAttendance = attendanceData.length > 0 
    ? Math.round(attendanceData.reduce((sum, item) => sum + item.percentage, 0) / attendanceData.length)
    : 0;

  const chartConfig = {
    percentage: {
      label: "Attendance %",
      color: "hsl(var(--chart-1))",
    },
  };

  const pieChartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">Loading your class schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchTimetable}
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
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">Unable to load student data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const nextClass = getNextClass();

  return (
    <div className="space-y-6 p-4 max-w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">
            {studentData.branch} - Year {studentData.year}, Semester {studentData.semester}, Section {studentData.section}
          </p>
        </div>
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Week</SelectItem>
            <SelectItem value="next">Next Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTodaysClasses()}</div>
            <p className="text-xs text-muted-foreground">Classes scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextClass ? nextClass.subject : 'No classes'}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextClass ? nextClass.time_slot : 'today'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              {overallAttendance >= 75 ? 'Good standing' : 'Needs improvement'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Analysis Chart */}
      {attendanceData.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Subject-wise Attendance Distribution</CardTitle>
            <CardDescription>Your attendance percentage across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="percentage"
                    label={({ subject, percentage }) => `${subject}: ${percentage}%`}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background p-2 border rounded shadow">
                            <p className="font-medium">{data.subject}</p>
                            <p className="text-sm">{`Attendance: ${data.percentage}%`}</p>
                            <p className="text-sm">{`Classes: ${data.attended}/${data.total}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Timetable with Fixed Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
          <CardDescription>Your complete weekly schedule with fixed time slots for Year {studentData.year}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-7 gap-1 mb-2">
                <div className="font-semibold text-center p-1 bg-gray-50 rounded text-xs">Time</div>
                {days.map(day => (
                  <div key={day} className="font-semibold text-center p-1 bg-gray-50 rounded text-xs">
                    {day.substring(0, 3)}
                  </div>
                ))}
              </div>
              
              {timeSlots.map(timeSlot => (
                <div key={timeSlot} className="grid grid-cols-7 gap-1 mb-1">
                  <div className={`text-xs font-medium p-1 rounded text-center ${
                    isLunchSlot(timeSlot)
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-gray-100'
                  }`}>
                    {isLunchSlot(timeSlot) ? 'Lunch' : timeSlot.split('-')[0]}
                  </div>
                  {isLunchSlot(timeSlot) ? (
                    // Lunch break row
                    days.map(day => (
                      <div key={`${day}-${timeSlot}`} className="min-h-[40px]">
                        <div className="p-1 rounded border bg-orange-50 text-center text-xs text-orange-700 border-orange-200">
                          Lunch
                        </div>
                      </div>
                    ))
                  ) : (
                    // Regular class rows
                    days.map(day => {
                      const daySchedule = timetableData[day] || [];
                      const classItem = daySchedule.find(item => item.time_slot === timeSlot);
                      
                      return (
                        <div key={`${day}-${timeSlot}`} className="min-h-[40px]">
                          {classItem ? (
                            <div className={`p-1 rounded border text-xs font-medium text-center ${getSubjectColor(classItem.subject)}`}>
                              {classItem.subject.length > 8 ? classItem.subject.substring(0, 8) + '...' : classItem.subject}
                            </div>
                          ) : (
                            <div className="p-1 border border-gray-200 rounded bg-gray-50 text-center text-xs text-gray-400">
                              Free
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Overview */}
      {Object.keys(timetableData).some(day => timetableData[day].length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Schedule Overview</CardTitle>
            <CardDescription>Subject-wise class distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from(new Set(
                Object.values(timetableData).flat().map(item => item.subject)
              )).map(subject => {
                const totalClasses = Object.values(timetableData).flat().filter(item => 
                  item.subject === subject
                ).length;
                
                const subjectAttendance = attendanceData.find(att => att.subject === subject);
                
                return (
                  <div key={subject} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">{subject}</div>
                    <div className="text-xl font-bold">{totalClasses}</div>
                    <div className="text-xs text-gray-500 mb-2">classes/week</div>
                    {subjectAttendance && (
                      <div className={`text-xs font-medium px-2 py-1 rounded ${
                        subjectAttendance.percentage >= 75 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subjectAttendance.percentage}% attendance
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
