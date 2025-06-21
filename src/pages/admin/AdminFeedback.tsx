
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';

export const AdminFeedback: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  const feedbackList = [
    {
      id: '1',
      studentName: 'John Doe',
      rollNumber: 'CS21001',
      type: 'academic',
      title: 'Course Content Feedback',
      message: 'The mathematics course is quite challenging but well-structured. However, I would suggest adding more practical examples.',
      status: 'pending' as const,
      adminResponse: '',
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-10T10:30:00Z'
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      rollNumber: 'CS21002',
      type: 'non-academic',
      title: 'Cafeteria Food Quality',
      message: 'The food quality in the cafeteria has been inconsistent lately. Some days the food is cold and taste is not good.',
      status: 'in-review' as const,
      adminResponse: '',
      createdAt: '2024-01-08T16:45:00Z',
      updatedAt: '2024-01-09T10:20:00Z'
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      rollNumber: 'CS21003',
      type: 'app-feedback',
      title: 'App Performance Issue',
      message: 'The mobile app is sometimes slow to load the timetable section. It would be great if this could be optimized.',
      status: 'resolved' as const,
      adminResponse: 'Thank you for reporting this issue. Our technical team has optimized the timetable loading and the fix has been deployed.',
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-07T14:30:00Z'
    },
    {
      id: '4',
      studentName: 'Sarah Wilson',
      rollNumber: 'CS21004',
      type: 'academic',
      title: 'Laboratory Equipment Request',
      message: 'The computer science lab needs updated software for web development courses. Current versions are outdated.',
      status: 'in-review' as const,
      adminResponse: '',
      createdAt: '2024-01-12T11:45:00Z',
      updatedAt: '2024-01-12T11:45:00Z'
    },
  ];

  const filteredFeedback = feedbackList.filter(feedback => {
    if (filter === 'all') return true;
    return feedback.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in-review': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-review': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'academic': return 'Academic';
      case 'non-academic': return 'Non-Academic';
      case 'app-feedback': return 'App Feedback';
      default: return type;
    }
  };

  const updateStatus = (feedbackId: string, newStatus: string, adminResponse?: string) => {
    console.log('Updating feedback status:', { feedbackId, newStatus, adminResponse });
    // In a real app, this would update the database
    setSelectedFeedback(null);
    setResponse('');
  };

  const pendingCount = feedbackList.filter(f => f.status === 'pending').length;
  const inReviewCount = feedbackList.filter(f => f.status === 'in-review').length;
  const resolvedCount = feedbackList.filter(f => f.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
        <p className="text-gray-600">Review and respond to student feedback and grievances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackList.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inReviewCount}</div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Student Feedback</CardTitle>
              <CardDescription>Review and respond to student submissions</CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feedback</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
                <p className="text-gray-600">No feedback matches your current filter.</p>
              </div>
            ) : (
              filteredFeedback.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{feedback.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                          {feedback.status.replace('-', ' ')}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {getTypeLabel(feedback.type)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{feedback.studentName}</span> ({feedback.rollNumber})
                      </div>
                      <p className="text-gray-700 mb-3">{feedback.message}</p>
                      
                      {feedback.adminResponse && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                          <p className="text-sm font-medium text-blue-800 mb-1">Admin Response:</p>
                          <p className="text-sm text-blue-700">{feedback.adminResponse}</p>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(feedback.createdAt).toLocaleDateString()}
                        {feedback.updatedAt !== feedback.createdAt && (
                          <span> • Updated: {new Date(feedback.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusIcon(feedback.status)}
                      {feedback.status !== 'resolved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedFeedback(feedback.id)}
                        >
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {selectedFeedback === feedback.id && (
                    <div className="border-t pt-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Admin Response
                        </label>
                        <Textarea
                          placeholder="Enter your response..."
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => updateStatus(feedback.id, 'in-review', response)}
                        >
                          Mark as In Review
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(feedback.id, 'resolved', response)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Resolved
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFeedback(null);
                            setResponse('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
