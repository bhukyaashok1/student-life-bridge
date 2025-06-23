
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { GraduationCap, Save, Users } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../components/ui/use-toast';

interface StudentMark {
  student_id: string;
  student_name: string;
  roll_number: string;
  subject: string;
  mid1: number;
  mid2: number;
  assignment: number;
  total: number;
}

interface Subject {
  name: string;
}

export const AdminMarks: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
  const years = ['1', '2', '3', '4'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const sections = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    if (selectedBranch && selectedYear && selectedSemester) {
      fetchSubjects();
    }
  }, [selectedBranch, selectedYear, selectedSemester]);

  useEffect(() => {
    if (selectedBranch && selectedYear && selectedSemester && selectedSection && selectedSubject) {
      fetchStudentMarks();
    }
  }, [selectedBranch, selectedYear, selectedSemester, selectedSection, selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase.rpc('get_subjects_for_class', {
        p_branch: selectedBranch,
        p_year: parseInt(selectedYear),
        p_semester: parseInt(selectedSemester)
      });

      if (error) {
        console.error('Error fetching subjects:', error);
        toast({
          title: "Error",
          description: "Failed to fetch subjects",
          variant: "destructive",
        });
        return;
      }

      setSubjects(data || []);
      if (data && data.length > 0 && !selectedSubject) {
        setSelectedSubject(data[0].name);
      }
    } catch (error) {
      console.error('Error in fetchSubjects:', error);
    }
  };

  const fetchStudentMarks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_student_marks', {
        p_branch: selectedBranch,
        p_year: parseInt(selectedYear),
        p_semester: parseInt(selectedSemester),
        p_section: selectedSection,
        p_subject: selectedSubject
      });

      if (error) {
        console.error('Error fetching student marks:', error);
        toast({
          title: "Error",
          description: "Failed to fetch student marks",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched student marks:', data);
      setStudents(data || []);
    } catch (error) {
      console.error('Error in fetchStudentMarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentMark = (studentId: string, field: 'mid1' | 'mid2' | 'assignment', value: string) => {
    const numValue = parseFloat(value) || 0;
    setStudents(prev => prev.map(student => {
      if (student.student_id === studentId) {
        const updated = { ...student, [field]: numValue };
        // Recalculate total
        updated.total = Math.round(((updated.mid1 + updated.mid2 + updated.assignment) / 3) * 100) / 100;
        return updated;
      }
      return student;
    }));
  };

  const saveMarks = async () => {
    setSaving(true);
    try {
      for (const student of students) {
        const { error } = await supabase.rpc('save_student_marks', {
          p_student_id: student.student_id,
          p_subject: selectedSubject,
          p_branch: selectedBranch,
          p_year: parseInt(selectedYear),
          p_semester: parseInt(selectedSemester),
          p_section: selectedSection,
          p_mid1: student.mid1,
          p_mid2: student.mid2,
          p_assignment: student.assignment
        });

        if (error) {
          console.error('Error saving marks for student:', student.student_id, error);
          toast({
            title: "Error",
            description: `Failed to save marks for ${student.student_name}`,
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Success",
        description: "All marks saved successfully",
      });
    } catch (error) {
      console.error('Error in saveMarks:', error);
      toast({
        title: "Error",
        description: "Failed to save marks",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (marks: number) => {
    if (marks >= 90) return 'text-green-600';
    if (marks >= 80) return 'text-blue-600';
    if (marks >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeLetter = (marks: number) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    return 'F';
  };

  const averageMarks = students.length > 0 
    ? Math.round((students.reduce((sum, s) => sum + s.total, 0) / students.length) * 100) / 100
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marks Management</h1>
        <p className="text-gray-600">Manage and view student marks and grades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">In selected class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGradeColor(averageMarks)}`}>
              {averageMarks.toString()}
            </div>
            <p className="text-xs text-muted-foreground">Class average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subject</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedSubject || 'None'}</div>
            <p className="text-xs text-muted-foreground">Selected subject</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Students</CardTitle>
          <CardDescription>Select class and subject to manage marks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>Year {year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger>
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map(sem => (
                  <SelectItem key={sem} value={sem}>Sem {sem}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map(section => (
                  <SelectItem key={section} value={section}>Section {section}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.name} value={subject.name}>{subject.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={fetchStudentMarks} disabled={loading || !selectedSubject}>
              {loading ? 'Loading...' : 'Load Marks'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Student Marks - {selectedSubject}</CardTitle>
              <CardDescription>
                {selectedBranch} - Year {selectedYear}, Semester {selectedSemester}, Section {selectedSection}
              </CardDescription>
            </div>
            <Button onClick={saveMarks} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save All Marks'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Roll Number</th>
                    <th className="text-left p-3 font-medium">Student Name</th>
                    <th className="text-center p-3 font-medium">Mid-1 (25)</th>
                    <th className="text-center p-3 font-medium">Mid-2 (25)</th>
                    <th className="text-center p-3 font-medium">Assignment (25)</th>
                    <th className="text-center p-3 font-medium">Total</th>
                    <th className="text-center p-3 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.student_id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{student.roll_number}</td>
                      <td className="p-3">{student.student_name}</td>
                      <td className="text-center p-3">
                        <Input
                          type="number"
                          min="0"
                          max="25"
                          value={student.mid1.toString()}
                          onChange={(e) => updateStudentMark(student.student_id, 'mid1', e.target.value)}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className="text-center p-3">
                        <Input
                          type="number"
                          min="0"
                          max="25"
                          value={student.mid2.toString()}
                          onChange={(e) => updateStudentMark(student.student_id, 'mid2', e.target.value)}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className="text-center p-3">
                        <Input
                          type="number"
                          min="0"
                          max="25"
                          value={student.assignment.toString()}
                          onChange={(e) => updateStudentMark(student.student_id, 'assignment', e.target.value)}
                          className="w-20 text-center"
                        />
                      </td>
                      <td className={`text-center p-3 font-bold ${getGradeColor(student.total)}`}>
                        {student.total.toString()}
                      </td>
                      <td className={`text-center p-3 font-bold ${getGradeColor(student.total)}`}>
                        {getGradeLetter(student.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && students.length === 0 && selectedSubject && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No students found for the selected criteria.</p>
            <p className="text-sm text-gray-400 mt-2">
              Make sure students are enrolled in {selectedBranch} - Year {selectedYear}, Semester {selectedSemester}, Section {selectedSection}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
