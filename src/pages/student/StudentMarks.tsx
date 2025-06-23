
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { GraduationCap, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';

interface StudentMark {
  id: string;
  subject: string;
  mid1: number;
  mid2: number;
  assignment: number;
  total: number;
  semester: number;
}

export const StudentMarks: React.FC = () => {
  const { studentData } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentData) {
      setSelectedSemester(studentData.semester.toString());
      fetchMarks();
    }
  }, [studentData]);

  useEffect(() => {
    if (studentData && selectedSemester) {
      fetchMarks();
    }
  }, [selectedSemester, studentData]);

  const fetchMarks = async () => {
    if (!studentData) return;

    try {
      setLoading(true);
      
      // Fetch marks for the student
      const { data: marksData, error: marksError } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', studentData.id)
        .eq('semester', selectedSemester ? parseInt(selectedSemester) : studentData.semester)
        .order('subject');

      if (marksError) {
        console.error('Error fetching marks:', marksError);
        return;
      }

      console.log('Fetched marks data:', marksData);
      setMarks(marksData || []);
    } catch (error) {
      console.error('Error in fetchMarks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marks & Grades</h1>
          <p className="text-gray-600">Loading your academic performance...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marks & Grades</h1>
          <p className="text-gray-600">Please complete your profile to view marks</p>
        </div>
      </div>
    );
  }

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

  const currentSemesterMarks = marks.filter(mark => mark.semester === parseInt(selectedSemester));
  const currentSGPA = currentSemesterMarks.length > 0 
    ? Math.round((currentSemesterMarks.reduce((sum, mark) => sum + mark.total, 0) / currentSemesterMarks.length) * 100) / 100
    : studentData.sgpa;

  const semesters = Array.from({ length: 8 }, (_, i) => (i + 1).toString());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marks & Grades</h1>
          <p className="text-gray-600">View your academic performance and grades</p>
        </div>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map(sem => (
              <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current SGPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{currentSGPA}</div>
            <p className="text-xs text-muted-foreground">Semester {selectedSemester}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall CGPA</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{studentData.cgpa}</div>
            <p className="text-xs text-muted-foreground">Cumulative</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{currentSemesterMarks.length}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Marks - Semester {selectedSemester}</CardTitle>
          <CardDescription>Detailed breakdown of your marks for each subject</CardDescription>
        </CardHeader>
        <CardContent>
          {currentSemesterMarks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Subject</th>
                    <th className="text-center p-3 font-medium">Mid-1</th>
                    <th className="text-center p-3 font-medium">Mid-2</th>
                    <th className="text-center p-3 font-medium">Assignment</th>
                    <th className="text-center p-3 font-medium">Total</th>
                    <th className="text-center p-3 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSemesterMarks.map((mark) => (
                    <tr key={mark.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{mark.subject}</td>
                      <td className="text-center p-3">{mark.mid1}</td>
                      <td className="text-center p-3">{mark.mid2}</td>
                      <td className="text-center p-3">{mark.assignment}</td>
                      <td className={`text-center p-3 font-bold ${getGradeColor(mark.total)}`}>
                        {mark.total}
                      </td>
                      <td className={`text-center p-3 font-bold ${getGradeColor(mark.total)}`}>
                        {getGradeLetter(mark.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No marks available for Semester {selectedSemester}</p>
              <p className="text-sm text-gray-400 mt-2">
                Marks will appear here once they are entered by your instructors
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Overview</CardTitle>
          <CardDescription>Your overall academic performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Current Semester Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Semester:</span>
                  <span className="text-sm font-medium">{selectedSemester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">SGPA:</span>
                  <span className="text-sm font-medium">{currentSGPA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Subjects:</span>
                  <span className="text-sm font-medium">{currentSemesterMarks.length}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Overall Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Year:</span>
                  <span className="text-sm font-medium">{studentData.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CGPA:</span>
                  <span className="text-sm font-medium">{studentData.cgpa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Branch:</span>
                  <span className="text-sm font-medium">{studentData.branch}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
