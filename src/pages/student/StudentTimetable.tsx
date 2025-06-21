
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';

interface TimetableEntry {
  id: string;
  day_of_week: string;
  time_slot: string;
  subject: string;
}

export const StudentTimetable: React.FC = () => {
  const { studentData } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [timetableData, setTimetableData] = useState<Record<string, TimetableEntry[]>>({});
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ["09:00-10:00", "10:00-11:00", "11:30-12:30", "01:30-02:30", "02:30-03:30"];

  useEffect(() => {
    if (studentData) {
      fetchTimetable();
    }
  }, [studentData]);

  const fetchTimetable = async () => {
    if (!studentData) return;

    try {
      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .eq('branch', studentData.branch)
        .eq('year', studentData.year)
        .eq('semester', studentData.semester)
        .eq('section', studentData.section)
        .order('day_of_week')
        .order('time_slot');

      if (error) {
        console.error('Error fetching timetable:', error);
        return;
      }

      // Group by day
      const groupedData: Record<string, TimetableEntry[]> = {};
      days.forEach(day => {
        groupedData[day] = data?.filter(item => item.day_of_week === day) || [];
      });

      setTimetableData(groupedData);
    } catch (error) {
      console.error('Error in fetchTimetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Physics': 'bg-green-100 text-green-800 border-green-200',
      'Chemistry': 'bg-purple-100 text-purple-800 border-purple-200',
      'English': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Computer Science': 'bg-red-100 text-red-800 border-red-200',
      'Physics Lab': 'bg-green-200 text-green-900 border-green-300',
      'Chemistry Lab': 'bg-purple-200 text-purple-900 border-purple-300',
      'Computer Science Lab': 'bg-red-200 text-red-900 border-red-300',
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">Loading your class schedule...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">Please complete your profile to view timetable</p>
        </div>
      </div>
    );
  }

  const nextClass = getNextClass();

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
      </div>

      {Object.keys(timetableData).some(day => timetableData[day].length > 0) ? (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Timetable</CardTitle>
            <CardDescription>Your complete weekly schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  <div className="font-semibold text-center p-2 bg-gray-50 rounded">Time</div>
                  {days.map(day => (
                    <div key={day} className="font-semibold text-center p-2 bg-gray-50 rounded">
                      {day}
                    </div>
                  ))}
                </div>
                
                {timeSlots.map(timeSlot => (
                  <div key={timeSlot} className="grid grid-cols-7 gap-2 mb-2">
                    <div className="text-sm font-medium p-2 bg-gray-100 rounded text-center">
                      {timeSlot}
                    </div>
                    {days.map(day => {
                      const daySchedule = timetableData[day] || [];
                      const classItem = daySchedule.find(item => item.time_slot === timeSlot);
                      
                      return (
                        <div key={`${day}-${timeSlot}`} className="min-h-[50px]">
                          {classItem ? (
                            <div className={`p-2 rounded border text-xs font-medium text-center ${getSubjectColor(classItem.subject)}`}>
                              {classItem.subject}
                            </div>
                          ) : (
                            <div className="p-2 border border-gray-200 rounded bg-gray-50 text-center text-xs text-gray-400">
                              Free
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Timetable Available</CardTitle>
            <CardDescription>
              No timetable has been created for your class yet. Please contact your administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {Object.keys(timetableData).some(day => timetableData[day].length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Schedule Overview</CardTitle>
            <CardDescription>Subject-wise class distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from(new Set(
                Object.values(timetableData).flat().map(item => item.subject)
              )).map(subject => {
                const totalClasses = Object.values(timetableData).flat().filter(item => 
                  item.subject === subject
                ).length;
                
                return (
                  <div key={subject} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">{subject}</div>
                    <div className="text-xl font-bold">{totalClasses}</div>
                    <div className="text-xs text-gray-500">classes/week</div>
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
