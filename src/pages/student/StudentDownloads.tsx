
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Download, FileText, Calendar, Search, File } from 'lucide-react';

export const StudentDownloads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const downloadableFiles = [
    {
      id: '1',
      type: 'Academic Calendar',
      fileName: 'Academic_Calendar_2023-24.pdf',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-08-15T10:00:00Z'
    },
    {
      id: '2',
      type: 'Timetable',
      fileName: 'CSE_Semester5_Timetable.pdf',
      url: '#',
      year: 2023,
      semester: 5,
      uploadedAt: '2023-09-01T14:30:00Z'
    },
    {
      id: '3',
      type: 'Syllabus',
      fileName: 'Mathematics_Syllabus_Sem5.pdf',
      url: '#',
      year: 2023,
      semester: 5,
      uploadedAt: '2023-08-20T09:15:00Z'
    },
    {
      id: '4',
      type: 'Exam Guidelines',
      fileName: 'End_Semester_Exam_Guidelines.pdf',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-11-15T16:45:00Z'
    },
    {
      id: '5',
      type: 'Fee Structure',
      fileName: 'Fee_Structure_2023-24.pdf',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-07-10T11:20:00Z'
    },
    {
      id: '6',
      type: 'Assignment Template',
      fileName: 'Assignment_Submission_Template.docx',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-08-25T13:10:00Z'
    },
    {
      id: '7',
      type: 'Holiday List',
      fileName: 'Holiday_List_2023-24.pdf',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-08-01T08:30:00Z'
    },
    {
      id: '8',
      type: 'Project Guidelines',
      fileName: 'Final_Year_Project_Guidelines.pdf',
      url: '#',
      year: 2023,
      semester: null,
      uploadedAt: '2023-09-10T15:20:00Z'
    },
  ];

  const fileTypes = [...new Set(downloadableFiles.map(file => file.type))];

  const filteredFiles = downloadableFiles.filter(file => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleDownload = (file: typeof downloadableFiles[0]) => {
    console.log(`Downloading ${file.fileName}`);
    // In a real app, this would trigger the actual download
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

  const getFileSize = () => {
    // Mock file sizes
    const sizes = ['245 KB', '1.2 MB', '856 KB', '2.1 MB', '445 KB', '678 KB', '123 KB', '1.8 MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Downloads</h1>
        <p className="text-gray-600">Access and download important academic documents and resources</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find the documents you need quickly</CardDescription>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredFiles.length}</div>
            <p className="text-xs text-muted-foreground">Available downloads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">File Types</CardTitle>
            <File className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileTypes.length}</div>
            <p className="text-xs text-muted-foreground">Different categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Total downloads</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Downloads</CardTitle>
          <CardDescription>
            {filteredFiles.length} files available
            {filterType !== 'all' && ` in ${filterType}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600">Try adjusting your search or filter to find files.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.fileName)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{file.fileName}</h4>
                        <p className="text-sm text-gray-600">{file.type}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Size:</span>
                      <span className="text-gray-900">{getFileSize()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Uploaded:</span>
                      <span className="text-gray-900">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {file.semester && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Semester:</span>
                        <span className="text-gray-900">{file.semester}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleDownload(file)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
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
