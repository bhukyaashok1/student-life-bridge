
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { FileText, Upload, Download, Trash2, Search, Plus, File } from 'lucide-react';

export const AdminDownloads: React.FC = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [uploadForm, setUploadForm] = useState({
    type: '',
    fileName: '',
    year: '',
    semester: '',
    file: null as File | null
  });

  const downloadableFiles = [
    {
      id: '1',
      type: 'Academic Calendar',
      fileName: 'Academic_Calendar_2023-24.pdf',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-08-15T10:00:00Z',
      downloads: 245
    },
    {
      id: '2',
      type: 'Timetable',
      fileName: 'CSE_Semester5_Timetable.pdf',
      url: '#',
      year: 2023,
      semester: 5,
      uploadedAt: '2023-09-01T14:30:00Z',
      downloads: 89
    },
    {
      id: '3',
      type: 'Fee Structure',
      fileName: 'Fee_Structure_2023-24.pdf',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-07-10T11:20:00Z',
      downloads: 156
    },
    {
      id: '4',
      type: 'Exam Guidelines',
      fileName: 'End_Semester_Exam_Guidelines.pdf',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-11-15T16:45:00Z',
      downloads: 203
    },
    {
      id: '5',
      type: 'Holiday List',
      fileName: 'Holiday_List_2023-24.pdf',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-08-01T08:30:00Z',
      downloads: 178
    },
  ];

  const fileTypes = [...new Set(downloadableFiles.map(file => file.type))];

  const filteredFiles = downloadableFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Uploading file:', uploadForm);
    // In a real app, this would upload to the server
    setUploadForm({ type: '', fileName: '', year: '', semester: '', file: null });
    setShowUploadForm(false);
  };

  const handleDelete = (fileId: string) => {
    console.log('Deleting file:', fileId);
    // In a real app, this would delete from the database
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'doc':
      case 'docx':
        return <File className="h-6 w-6 text-blue-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Downloads Management</h1>
          <p className="text-gray-600">Upload and manage downloadable resources for students</p>
        </div>
        <Button onClick={() => setShowUploadForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloadableFiles.length}</div>
            <p className="text-xs text-muted-foreground">Available files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {downloadableFiles.reduce((sum, file) => sum + file.downloads, 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">File Types</CardTitle>
            <File className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileTypes.length}</div>
            <p className="text-xs text-muted-foreground">Different categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Upload className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Files uploaded</p>
          </CardContent>
        </Card>
      </div>

      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New File</CardTitle>
            <CardDescription>Add a new downloadable resource for students</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">File Type</Label>
                  <Select value={uploadForm.type} onValueChange={(value) => setUploadForm({ ...uploadForm, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic Calendar">Academic Calendar</SelectItem>
                      <SelectItem value="Timetable">Timetable</SelectItem>
                      <SelectItem value="Fee Structure">Fee Structure</SelectItem>
                      <SelectItem value="Exam Guidelines">Exam Guidelines</SelectItem>
                      <SelectItem value="Holiday List">Holiday List</SelectItem>
                      <SelectItem value="Syllabus">Syllabus</SelectItem>
                      <SelectItem value="Assignment Template">Assignment Template</SelectItem>
                      <SelectItem value="Project Guidelines">Project Guidelines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fileName">File Name</Label>
                  <Input
                    id="fileName"
                    placeholder="e.g., Academic_Calendar_2024"
                    value={uploadForm.fileName}
                    onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="year">Academic Year (Optional)</Label>
                  <Select value={uploadForm.year} onValueChange={(value) => setUploadForm({ ...uploadForm, year: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not Specific</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="semester">Semester (Optional)</Label>
                  <Select value={uploadForm.semester} onValueChange={(value) => setUploadForm({ ...uploadForm, semester: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Semesters</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="file">Upload File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
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
          <CardDescription>Find specific files quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {fileTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Downloadable Files</CardTitle>
          <CardDescription>
            Showing {filteredFiles.length} of {downloadableFiles.length} files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  {getFileIcon(file.fileName)}
                  <div>
                    <h4 className="font-medium text-gray-900">{file.fileName}</h4>
                    <p className="text-sm text-gray-600">{file.type}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{file.downloads} downloads</span>
                      {file.year && (
                        <>
                          <span>•</span>
                          <span>Year {file.year}</span>
                        </>
                      )}
                      {file.semester && (
                        <>
                          <span>•</span>
                          <span>Semester {file.semester}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(file.id)}>
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
