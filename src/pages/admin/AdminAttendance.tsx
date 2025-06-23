
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../components/ui/use-toast';

interface Student {
  id: string;
  roll_number: string;
  profiles: {
    full_name: string;
  };
}

interface AttendanceRecord {
  student_id: string;
  is_present: boolean;
}

export const AdminAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, [selectedBranch, selectedYear, selectedSection]);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, selectedBranch, selectedYear, selectedSection, selectedSubject]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          roll_number,
          profiles:profile_id (
            full_name
          )
        `)
        .eq('branch', selectedBranch)
        .eq('year', parseInt(selectedYear))
        .eq('section', selectedSection)
        .order('roll_number');

      if (error) {
        console.error('Error fetching students:', error);
        return;
      }

      setStudents(data || []);
      
      // Initialize attendance for new students
      const initialAttendance = {};
      data?.forEach(student => {
        initialAttendance[student.id] = false;
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error in fetchStudents:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('name')
        .eq('branch', selectedBranch)
        .eq('year', parseInt(selectedYear));

      if (error) {
        console.error('Error fetching subjects:', error);
        return;
      }

      const subjectNames = [...new Set(data?.map(s => s.name) || [])];
      setSubjects(subjectNames);
      
      if (subjectNames.length > 0 && !subjectNames.includes(selectedSubject)) {
        setSelectedSubject(subjectNames[0]);
      }
    } catch (error) {
      console.error('Error in fetchSubjects:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('student_id, is_present')
        .eq('date', selectedDate)
        .eq('subject', selectedSubject)
        .eq('branch', selectedBranch)
        .eq('year', parseInt(selectedYear))
        .eq('section', selectedSection);

      if (error) {
        console.error('Error fetching attendance:', error);
        return;
      }

      const attendanceMap = {};
      students.forEach(student => {
        const record = data?.find(a => a.student_id === student.id);
        attendanceMap[student.id] = record ? record.is_present : false;
      });
      
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error in fetchAttendance:', error);
    }
  };

  const markAttendance = (studentId: string, isPresent: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const markAllPresent = () => {
    const newAttendance = { ...attendance };
    students.forEach(student => {
      newAttendance[student.id] = true;
    });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = { ...attendance };
    students.forEach(student => {
      newAttendance[student.id] = false;
    });
    setAttendance(newAttendance);
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      // Delete existing attendance for this date/subject/class
      await supabase
        .from('attendance')
        .delete()
        .eq('date', selectedDate)
        .eq('subject', selectedSubject)
        .eq('branch', selectedBranch)
        .eq('year', parseInt(selectedYear))
        .eq('section', selectedSection);

      // Insert new attendance records
      const attendanceRecords = students.map(student => ({
        student_id: student.id,
        date: selectedDate,
        subject: selectedSubject,
        branch: selectedBranch,
        year: parseInt(selectedYear),
        section: selectedSection,
        is_present: attendance[student.id] || false
      }));

      const { error } = await supabase
        .from('attendance')
        .insert(attendanceRecords);

      if (error) {
        console.error('Error saving attendance:', error);
        toast({
          title: "Error",
          description: "Failed to save attendance",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Attendance saved successfully",
      });
    } catch (error) {
      console.error('Error in saveAttendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const attendanceStats = {
    total: students.length,
    present: Object.values(attendance).filter(Boolean).length,
    absent: Object.values(attendance).filter(p => !p).length,
    percentage: students.length > 0 ? Math.round((Object.values(attendance).filter(Boolean).length / students.length) * 100) : 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        <p className="text-gray-600">Mark and manage student attendance for classes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class Details</CardTitle>
          <CardDescription>Choose the class and date for attendance marking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Year 1</SelectItem>
                <SelectItem value="2">Year 2</SelectItem>
                <SelectItem value="3">Year 3</SelectItem>
                <SelectItem value="4">Year 4</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.total}</div>
            <p className="text-xs text-muted-foreground">In this class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
            <p className="text-xs text-muted-foreground">Students present</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
            <p className="text-xs text-muted-foreground">Students absent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Percentage</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{attendanceStats.percentage}%</div>
            <p className="text-xs text-muted-foreground">Attendance rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                {selectedSubject} - {selectedBranch} Year {selectedYear} Section {selectedSection}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={markAllPresent}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Present
              </Button>
              <Button variant="outline" onClick={markAllAbsent}>
                <XCircle className="h-4 w-4 mr-2" />
                Mark All Absent
              </Button>
              <Button onClick={saveAttendance} disabled={loading}>
                {loading ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {student.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{student.profiles?.full_name}</h4>
                    <p className="text-sm text-gray-600">{student.roll_number}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={attendance[student.id] ? "default" : "outline"}
                    onClick={() => markAttendance(student.id, true)}
                    className={attendance[student.id] ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    size="sm"
                    variant={!attendance[student.id] ? "default" : "outline"}
                    onClick={() => markAttendance(student.id, false)}
                    className={!attendance[student.id] ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
