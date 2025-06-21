
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { GraduationCap, Users, TrendingUp, Save } from 'lucide-react';

export const AdminMarks: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedExamType, setSelectedExamType] = useState('mid1');

  const students = [
    { id: '1', name: 'John Doe', rollNumber: 'CS21001', mid1: 85, mid2: 90, assignment: 88, endExam: 87 },
    { id: '2', name: 'Jane Smith', rollNumber: 'CS21002', mid1: 92, mid2: 88, assignment: 90, endExam: 91 },
    { id: '3', name: 'Mike Johnson', rollNumber: 'CS21003', mid1: 78, mid2: 82, assignment: 85, endExam: 80 },
    { id: '4', name: 'Sarah Wilson', rollNumber: 'CS21004', mid1: 88, mid2: 85, assignment: 87, endExam: 86 },
    { id: '5', name: 'David Brown', rollNumber: 'CS21005', mid1: 95, mid2: 93, assignment: 96, endExam: 94 },
  ];

  const [marks, setMarks] = useState(
    students.reduce((acc, student) => {
      acc[student.id] = {
        mid1: student.mid1,
        mid2: student.mid2,
        assignment: student.assignment,
        endExam: student.endExam
      };
      return acc;
    }, {} as Record<string, Record<string, number>>)
  );

  const updateMark = (studentId: string, examType: string, value: number) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [examType]: value
      }
    }));
  };

  const calculateTotal = (studentId: string) => {
    const studentMarks = marks[studentId];
    return ((studentMarks.mid1 + studentMarks.mid2 + studentMarks.assignment + studentMarks.endExam) / 4).toFixed(1);
  };

  const getGrade = (total: number) => {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    return 'F';
  };

  const saveMarks = () => {
    console.log('Saving marks:', {
      branch: selectedBranch,
      year: selectedYear,
      semester: selectedSemester,
      subject: selectedSubject,
      marks
    });
    // In a real app, this would save to the database
  };

  const classAverage = students.reduce((sum, student) => sum + parseFloat(calculateTotal(student.id)), 0) / students.length;

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
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
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
              {Math.max(...students.map(s => parseFloat(calculateTotal(s.id))))}
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
              {Math.round((students.filter(s => parseFloat(calculateTotal(s.id)) >= 60).length / students.length) * 100)}%
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
            <Button onClick={saveMarks}>
              <Save className="h-4 w-4 mr-2" />
              Save Marks
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
                  <th className="text-center p-3 font-medium">End Exam (25)</th>
                  <th className="text-center p-3 font-medium">Total</th>
                  <th className="text-center p-3 font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const total = parseFloat(calculateTotal(student.id));
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{student.name}</td>
                      <td className="text-center p-3">{student.rollNumber}</td>
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
                      <td className="text-center p-3">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={marks[student.id]?.endExam || ''}
                          onChange={(e) => updateMark(student.id, 'endExam', parseInt(e.target.value) || 0)}
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
