
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Users, Search, UserPlus, Edit, Eye, GraduationCap } from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  const students = [
    {
      id: '1',
      name: 'John Doe',
      rollNumber: 'CS21001',
      branch: 'Computer Science',
      section: 'A',
      year: 3,
      semester: 5,
      email: 'john.doe@college.edu',
      phone: '+1234567890',
      sgpa: 8.5,
      cgpa: 8.2,
      attendance: 85
    },
    {
      id: '2',
      name: 'Jane Smith',
      rollNumber: 'CS21002',
      branch: 'Computer Science',
      section: 'A',
      year: 3,
      semester: 5,
      email: 'jane.smith@college.edu',
      phone: '+1234567891',
      sgpa: 9.1,
      cgpa: 8.8,
      attendance: 92
    },
    {
      id: '3',
      name: 'Mike Johnson',
      rollNumber: 'EC21001',
      branch: 'Electronics',
      section: 'B',
      year: 2,
      semester: 3,
      email: 'mike.johnson@college.edu',
      phone: '+1234567892',
      sgpa: 7.8,
      cgpa: 7.9,
      attendance: 78
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      rollNumber: 'ME21001',
      branch: 'Mechanical',
      section: 'A',
      year: 4,
      semester: 7,
      email: 'sarah.wilson@college.edu',
      phone: '+1234567893',
      sgpa: 8.9,
      cgpa: 8.5,
      attendance: 89
    },
    {
      id: '5',
      name: 'David Brown',
      rollNumber: 'CS21003',
      branch: 'Computer Science',
      section: 'B',
      year: 1,
      semester: 1,
      email: 'david.brown@college.edu',
      phone: '+1234567894',
      sgpa: 8.0,
      cgpa: 8.0,
      attendance: 95
    },
  ];

  const branches = [...new Set(students.map(s => s.branch))];
  const years = [...new Set(students.map(s => s.year))].sort();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = filterBranch === 'all' || student.branch === filterBranch;
    const matchesYear = filterYear === 'all' || student.year.toString() === filterYear;
    
    return matchesSearch && matchesBranch && matchesYear;
  });

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCGPAColor = (cgpa: number) => {
    if (cgpa >= 8.5) return 'text-green-600';
    if (cgpa >= 7.0) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage student records and information</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Branches</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branches.length}</div>
            <p className="text-xs text-muted-foreground">Different branches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(students.reduce((sum, s) => sum + s.cgpa, 0) / students.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Class attendance</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Students</CardTitle>
          <CardDescription>Find and filter students by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, roll number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBranch} onValueChange={setFilterBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>Year {year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Showing {filteredStudents.length} of {students.length} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-left p-3 font-medium">Roll Number</th>
                  <th className="text-left p-3 font-medium">Branch</th>
                  <th className="text-center p-3 font-medium">Year/Sem</th>
                  <th className="text-center p-3 font-medium">CGPA</th>
                  <th className="text-center p-3 font-medium">Attendance</th>
                  <th className="text-center p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.email}</div>
                      </div>
                    </td>
                    <td className="p-3 font-medium">{student.rollNumber}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{student.branch}</div>
                        <div className="text-sm text-gray-600">Section {student.section}</div>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <div>
                        <div className="font-medium">Year {student.year}</div>
                        <div className="text-sm text-gray-600">Sem {student.semester}</div>
                      </div>
                    </td>
                    <td className={`text-center p-3 font-bold ${getCGPAColor(student.cgpa)}`}>
                      {student.cgpa}
                    </td>
                    <td className={`text-center p-3 font-bold ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
                    </td>
                    <td className="text-center p-3">
                      <div className="flex justify-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
