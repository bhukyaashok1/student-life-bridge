
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { GraduationCap, Users, TrendingUp, Save } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../components/ui/use-toast';

interface Student {
  id: string;
  roll_number: string;
  profiles: {
    full_name: string;
  };
}

interface Mark {
  student_id: string;
  mid1: number;
  mid2: number;
  assignment: number;
  total: number;
}

export const AdminMarks: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, [selectedBranch, selectedYear, selectedSemester]);

  useEffect(() => {
    fetchMarks();
  }, [selectedBranch, selectedYear, selectedSemester, selectedSubject]);

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
        .eq('semester', parseInt(selectedSemester))
        .order('roll_number');

      if (error) {
        console.error('Error fetching students:', error);
        return;
      }

      setStudents(data || []);
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
        .eq('year', parseInt(selectedYear))
        .eq('semester', parseInt(selectedSemester));

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

  const fetchMarks = async () => {
    try {
      const { data, error } = await supabase
        .from('marks')
        .select('*')
        .eq('subject', selectedSubject)
        .eq('branch', selectedBranch)
        .eq('year', parseInt(selectedYear))
        .eq('semester', parseInt(selectedSemester));

      if (error) {
        console.error('Error fetching marks:', error);
        return;
      }

      const marksMap = {};
      students.forEach(student => {
        const mark = data?.find(m => m.student_id === student.id);
        marksMap[student.id] = {
          student_id: student.id,
          mid1: mark?.mid1 || 0,
          mid2: mark?.mid2 || 0,
          assignment: mark?.assignment || 0,
          total: mark?.total || 0
        };
      });
      
      setMarks(marksMap);
    } catch (error) {
      console.error('Error in fetchMarks:', error);
    }
  };

  const updateMark = (studentId: string, field: string, value: number) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const calculateTotal = (studentId: string) => {
    const studentMarks = marks[studentId];
    if (!studentMarks) return 0;
    return ((studentMarks.mid1 + studentMarks.mid2 + studentMarks.assignment) / 3).toFixed(1);
  };

  const getGrade = (total: number) => {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    return 'F';
  };

  const saveMarks = async () => {
    setLoading(true);
    try {
      const marksToSave = Object.values(marks).map(mark => ({
        student_id: mark.student_id,
        subject: selectedSubject,
        branch: selectedBranch,
        year: parseInt(selectedYear),
        semester: parseInt(selectedSemester),
        mid1: mark.mid1,
        mid2: mark.mid2,
        assignment: mark.assignment
      }));

      // Delete existing marks for this subject/class
      await supabase
        .from('marks')
        .delete()
        .eq('subject', selectedSubject)
        .eq('branch', selectedBranch)
        .eq('year', parseInt(selectedYear))
        .eq('semester', parseInt(selectedSemester));

      // Insert new marks
      const { error } = await supabase
        .from('marks')
        .insert(marksToSave);

      if (error) {
        console.error('Error saving marks:', error);
        toast({
          title: "Error",
          description: "Failed to save marks",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Marks saved successfully",
      });
      
      fetchMarks(); // Refresh to get updated totals
    } catch (error) {
      console.error('Error in saveMarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const classAverage = students.length > 0 
    ? students.reduce((sum, student) => sum + parseFloat(calculateTotal(student.id)), 0) / students.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marks Management</h1>
        <p className="text-gray-600">Enter and manage student marks for various assessments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class & Subject</CardTitle>
          <CardDescription>Choose the class and subject for marks entry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
                <SelectItem value="3">Semester 3</SelectItem>
                <SelectItem value="4">Semester 4</SelectItem>
                <SelectItem value="5">Semester 5</SelectItem>
                <SelectItem value="6">Semester 6</SelectItem>
                <SelectItem value="7">Semester 7</SelectItem>
                <SelectItem value="8">Semester 8</SelectItem>
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
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">In this class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{classAverage.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Overall marks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {students.length > 0 ? Math.max(...students.map(s => parseFloat(calculateTotal(s.id)))) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Best performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <GraduationCap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {students.length > 0 ? Math.round((students.filter(s => parseFloat(calculateTotal(s.id)) >= 60).length / students.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Students passing</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Enter Marks</CardTitle>
              <CardDescription>
                {selectedSubject} - {selectedBranch} Year {selectedYear} Semester {selectedSemester}
              </CardDescription>
            </div>
            <Button onClick={saveMarks} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Marks"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-center p-3 font-medium">Roll Number</th>
                  <th className="text-center p-3 font-medium">Mid-1 (25)</th>
                  <th className="text-center p-3 font-medium">Mid-2 (25)</th>
                  <th className="text-center p-3 font-medium">Assignment (25)</th>
                  <th className="text-center p-3 font-medium">Total</th>
                  <th className="text-center p-3 font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const total = parseFloat(calculateTotal(student.id));
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{student.profiles?.full_name}</td>
                      <td className="text-center p-3">{student.roll_number}</td>
                      <td className="text-center p-3">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={marks[student.id]?.mid1 || ''}
                          onChange={(e) => updateMark(student.id, 'mid1', parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className="text-center p-3">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={marks[student.id]?.mid2 || ''}
                          onChange={(e) => updateMark(student.id, 'mid2', parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className="text-center p-3">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={marks[student.id]?.assignment || ''}
                          onChange={(e) => updateMark(student.id, 'assignment', parseInt(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className={`text-center p-3 font-bold ${
                        total >= 90 ? 'text-green-600' :
                        total >= 80 ? 'text-blue-600' :
                        total >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {calculateTotal(student.id)}
                      </td>
                      <td className={`text-center p-3 font-bold ${
                        total >= 90 ? 'text-green-600' :
                        total >= 80 ? 'text-blue-600' :
                        total >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {getGrade(total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
