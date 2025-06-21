
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { FileText, Download, Search, Calendar } from 'lucide-react';

export const StudentPapers: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const questionPapers = [
    {
      id: '1',
      title: 'Mathematics Mid-Term Exam 2023',
      subject: 'Mathematics',
      year: 3,
      semester: 5,
      filename: 'math_mid_2023.pdf',
      uploadedAt: '2023-10-15',
      url: '#'
    },
    {
      id: '2',
      title: 'Physics End Semester Exam 2023',
      subject: 'Physics',
      year: 3,
      semester: 5,
      filename: 'physics_end_2023.pdf',
      uploadedAt: '2023-12-20',
      url: '#'
    },
    {
      id: '3',
      title: 'Chemistry Mid-Term Exam 2023',
      subject: 'Chemistry',
      year: 3,
      semester: 5,
      filename: 'chemistry_mid_2023.pdf',
      uploadedAt: '2023-10-18',
      url: '#'
    },
    {
      id: '4',
      title: 'Computer Science Assignment Questions',
      subject: 'Computer Science',
      year: 3,
      semester: 5,
      filename: 'cs_assignment_2023.pdf',
      uploadedAt: '2023-11-05',
      url: '#'
    },
    {
      id: '5',
      title: 'English Communication Skills Exam',
      subject: 'English',
      year: 3,
      semester: 5,
      filename: 'english_exam_2023.pdf',
      uploadedAt: '2023-11-25',
      url: '#'
    },
  ];

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];

  const filteredPapers = questionPapers.filter(paper => {
    const matchesYear = paper.year.toString() === selectedYear;
    const matchesSemester = paper.semester.toString() === selectedSemester;
    const matchesSubject = selectedSubject === 'all' || paper.subject === selectedSubject;
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesYear && matchesSemester && matchesSubject && matchesSearch;
  });

  const handleDownload = (paper: typeof questionPapers[0]) => {
    console.log(`Downloading ${paper.filename}`);
    // In a real app, this would trigger the actual download
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Question Papers</h1>
        <p className="text-gray-600">Access previous year question papers and study materials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Papers</CardTitle>
          <CardDescription>Filter question papers by year, semester, and subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
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
                <SelectValue placeholder="Select Semester" />
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
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPapers.length}</div>
            <p className="text-xs text-muted-foreground">Available for download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Available subjects</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Question Papers</CardTitle>
          <CardDescription>
            Year {selectedYear}, Semester {selectedSemester} 
            {selectedSubject !== 'all' && ` - ${selectedSubject}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPapers.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No papers found</h3>
              <p className="text-gray-600">Try adjusting your filters to find question papers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPapers.map((paper) => (
                <div key={paper.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{paper.title}</h4>
                      <p className="text-sm text-gray-600">{paper.subject}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded on {new Date(paper.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleDownload(paper)}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
