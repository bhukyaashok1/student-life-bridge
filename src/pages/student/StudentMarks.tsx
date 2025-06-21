
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { GraduationCap, TrendingUp, Award } from 'lucide-react';

export const StudentMarks: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState('5');

  const marksData = {
    semester5: [
      { subject: 'Mathematics', mid1: 85, mid2: 90, assignment: 88, endExam: 87, total: 87.5 },
      { subject: 'Physics', mid1: 78, mid2: 82, assignment: 85, endExam: 80, total: 81.25 },
      { subject: 'Chemistry', mid1: 92, mid2: 88, assignment: 90, endExam: 91, total: 90.25 },
      { subject: 'English', mid1: 88, mid2: 85, assignment: 87, endExam: 86, total: 86.5 },
      { subject: 'Computer Science', mid1: 95, mid2: 93, assignment: 96, endExam: 94, total: 94.5 },
    ],
    currentSGPA: 8.5,
    overallCGPA: 8.2
  };

  const semesterHistory = [
    { semester: 1, sgpa: 7.8 },
    { semester: 2, sgpa: 8.0 },
    { semester: 3, sgpa: 8.1 },
    { semester: 4, sgpa: 8.3 },
    { semester: 5, sgpa: 8.5 },
  ];

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
            <SelectItem value="1">Semester 1</SelectItem>
            <SelectItem value="2">Semester 2</SelectItem>
            <SelectItem value="3">Semester 3</SelectItem>
            <SelectItem value="4">Semester 4</SelectItem>
            <SelectItem value="5">Semester 5</SelectItem>
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
            <div className="text-2xl font-bold text-blue-600">{marksData.currentSGPA}</div>
            <p className="text-xs text-muted-foreground">Semester {selectedSemester}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall CGPA</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{marksData.overallCGPA}</div>
            <p className="text-xs text-muted-foreground">Cumulative</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">↗ +0.2</div>
            <p className="text-xs text-muted-foreground">From last semester</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Marks - Semester {selectedSemester}</CardTitle>
          <CardDescription>Detailed breakdown of your marks for each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-center p-3 font-medium">Mid-1</th>
                  <th className="text-center p-3 font-medium">Mid-2</th>
                  <th className="text-center p-3 font-medium">Assignment</th>
                  <th className="text-center p-3 font-medium">End Exam</th>
                  <th className="text-center p-3 font-medium">Total</th>
                  <th className="text-center p-3 font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {marksData.semester5.map((subject, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{subject.subject}</td>
                    <td className="text-center p-3">{subject.mid1}</td>
                    <td className="text-center p-3">{subject.mid2}</td>
                    <td className="text-center p-3">{subject.assignment}</td>
                    <td className="text-center p-3">{subject.endExam}</td>
                    <td className={`text-center p-3 font-bold ${getGradeColor(subject.total)}`}>
                      {subject.total}
                    </td>
                    <td className={`text-center p-3 font-bold ${getGradeColor(subject.total)}`}>
                      {getGradeLetter(subject.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SGPA History</CardTitle>
          <CardDescription>Your semester-wise academic performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {semesterHistory.map((sem) => (
              <div key={sem.semester} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Semester {sem.semester}</div>
                <div className="text-xl font-bold text-blue-600">{sem.sgpa}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
