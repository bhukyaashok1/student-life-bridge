
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';

interface TimetableEntry {
  id: string;
  time_slot: string;
  subject: string;
  day_of_week: string;
}

interface AttendanceEntry {
  subject: string;
  is_present: boolean;
  time_slot: string;
}

export const SelfAttendanceMarker: React.FC = () => {
  const { studentData } = useAuth();
  const [todaysTimetable, setTodaysTimetable] = useState<TimetableEntry[]>([]);
  const [todaysAttendance, setTodaysAttendance] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = new Date();
  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (studentData) {
      fetchTodaysTimetable();
      fetchTodaysAttendance();
    }
  }, [studentData]);

  const fetchTodaysTimetable = async () => {
    if (!studentData) return;

    try {
      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .eq('branch', studentData.branch)
        .eq('year', studentData.year)
        .eq('semester', studentData.semester)
        .eq('section', studentData.section)
        .eq('day_of_week', today)
        .order('time_slot');

      if (error) {
        console.error('Error fetching timetable:', error);
        return;
      }

      setTodaysTimetable(data || []);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  const fetchTodaysAttendance = async () => {
    if (!studentData) return;

    try {
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', studentData.profile_id)
        .single();

      if (studentError) {
        console.error('Error fetching student record:', studentError);
        setLoading(false);
        return;
      }

      if (!studentRecord) {
        console.log('No student record found');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('attendance')
        .select('subject, is_present, time_slot')
        .eq('student_id', studentRecord.id)
        .eq('date', todayDate);

      if (error) {
        console.error('Error fetching attendance:', error);
        setLoading(false);
        return;
      }

      // Map the data to include time_slot from timetable if missing
      const attendanceWithTimeSlots = (data || []).map(att => {
        const timetableEntry = todaysTimetable.find(t => t.subject === att.subject);
        return {
          subject: att.subject,
          is_present: att.is_present,
          time_slot: att.time_slot || timetableEntry?.time_slot || ''
        };
      });

      setTodaysAttendance(attendanceWithTimeSlots);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setLoading(false);
    }
  };

  const markAttendance = async (subject: string, isPresent: boolean) => {
    if (!studentData) return;

    try {
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', studentData.profile_id)
        .single();

      if (studentError || !studentRecord) {
        toast({
          title: "Error",
          description: "Student record not found",
          variant: "destructive"
        });
        return;
      }

      // Get the time slot for this subject from timetable
      const timetableEntry = todaysTimetable.find(t => t.subject === subject);
      const timeSlot = timetableEntry?.time_slot || '';

      const { error } = await supabase
        .from('attendance')
        .upsert({
          student_id: studentRecord.id,
          date: todayDate,
          subject: subject,
          branch: studentData.branch,
          year: studentData.year,
          semester: studentData.semester,
          section: studentData.section,
          is_present: isPresent
        }, {
          onConflict: 'student_id,date,subject'
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to mark attendance",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: `Attendance marked as ${isPresent ? 'Present' : 'Absent'} for ${subject}`,
      });

      fetchTodaysAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const isTimeSlotActive = (timeSlot: string) => {
    const [startTime, endTime] = timeSlot.split('-');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTimeObj = new Date();
    startTimeObj.setHours(startHour, startMinute, 0, 0);
    
    const endTimeObj = new Date();
    endTimeObj.setHours(endHour, endMinute, 0, 0);
    
    return currentTime >= startTimeObj && currentTime <= endTimeObj;
  };

  const hasMarkedAttendance = (subject: string) => {
    return todaysAttendance.find(att => att.subject === subject);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>Loading today's schedule...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (todaysTimetable.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Attendance
          </CardTitle>
          <CardDescription>No classes scheduled for today ({today})</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Attendance - {today}
        </CardTitle>
        <CardDescription>Mark your attendance for today's classes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaysTimetable.map((entry) => {
            const attendanceRecord = hasMarkedAttendance(entry.subject);
            const isActive = isTimeSlotActive(entry.time_slot);
            
            return (
              <div
                key={entry.id}
                className={`p-4 border rounded-lg ${
                  isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{entry.time_slot}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{entry.subject}</p>
                      {isActive && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          Active Now
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {attendanceRecord ? (
                      <Badge
                        variant={attendanceRecord.is_present ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {attendanceRecord.is_present ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Present
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            Absent
                          </>
                        )}
                      </Badge>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => markAttendance(entry.subject, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => markAttendance(entry.subject, false)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> You can mark your attendance throughout the day. 
            Classes currently in session are highlighted in blue.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
