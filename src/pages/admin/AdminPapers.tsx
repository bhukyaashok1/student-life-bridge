
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { FileText, Upload, Download, Trash2, Search, Plus } from 'lucide-react';

export const AdminPapers: React.FC = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  const [uploadForm, setUploadForm] = useState({
    title: '',
    subject: '',
    year: '',
    semester: '',
    file: null as File | null
  });

  const questionPapers = [
    {
      id: '1',
      title: 'Mathematics Mid-Term Exam 2023',
      subject: 'Mathematics',
      year: 3,
      semester: 5,
      filename: 'math_mid_2023.pdf',
      uploadedAt: '2023-10-15',
      uploadedBy: 'Admin',
      downloads: 45
    },
    {
      id: '2',
      title: 'Physics End Semester Exam 2023',
      subject: 'Physics',
      year: 3,
      semester: 5,
      filename: 'physics_end_2023.pdf',
      uploadedAt: '2023-12-20',
      uploadedBy: 'Admin',
      downloads: 38
    },
    {
      id: '3',
      title: 'Chemistry Mid-Term Exam 2023',
      subject: 'Chemistry',
      year: 2,
      semester: 3,
      filename: 'chemistry_mid_2023.pdf',
      uploadedAt: '2023-10-18',
      uploadedBy: 'Admin',
      downloads: 32
    },
    {
      id: '4',
      title: 'Computer Science Assignment Questions',
      subject: 'Computer Science',
      year: 4,
      semester: 7,
      filename: 'cs_assignment_2023.pdf',
      uploadedAt: '2023-11-05',
      uploadedBy: 'Admin',
      downloads: 67
    },
  ];

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
  const years = [1, 2, 3, 4];

  const filteredPapers = questionPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'all' || paper.year.toString() === filterYear;
    const matchesSubject = filterSubject === 'all' || paper.subject === filterSubject;
    
    return matchesSearch && matchesYear && matchesSubject;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Uploading paper:', uploadForm);
    // In a real app, this would upload to the server
    setUploadForm({ title: '', subject: '', year: '', semester: '', file: null });
    setShowUploadForm(false);
  };

  const handleDelete = (paperId: string) => {
    console.log('Deleting paper:', paperId);
    // In a real app, this would delete from the database
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Papers Management</h1>
          <p className="text-gray-600">Upload and manage question papers for students</p>
        </div>
        <Button onClick={() => setShowUploadForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Paper
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questionPapers.length}</div>
            <p className="text-xs text-muted-foreground">Available papers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questionPapers.reduce((sum, paper) => sum + paper.downloads, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">Different subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Upload className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Papers uploaded</p>
          </CardContent>
        </Card>
      </div>

      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Question Paper</CardTitle>
            <CardDescription>Add a new question paper to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Paper Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Mathematics Mid-Term Exam 2024"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={uploadForm.subject} onValueChange={(value) => setUploadForm({ ...uploadForm, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select value={uploadForm.year} onValueChange={(value) => setUploadForm({ ...uploadForm, year: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>Year {year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={uploadForm.semester} onValueChange={(value) => setUploadForm({ ...uploadForm, semester: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="file">Upload File (PDF)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Paper
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific question papers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question Papers List</CardTitle>
          <CardDescription>
            Showing {filteredPapers.length} of {questionPapers.length} papers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPapers.map((paper) => (
              <div key={paper.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{paper.title}</h4>
                    <p className="text-sm text-gray-600">
                      {paper.subject} • Year {paper.year} • Semester {paper.semester}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded on {new Date(paper.uploadedAt).toLocaleDateString()} • {paper.downloads} downloads
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(paper.id)}>
                    <Trash2 className="h-4 w-4" />
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
