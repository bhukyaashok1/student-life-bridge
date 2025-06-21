
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const StudentFeedback: React.FC = () => {
  const [feedbackForm, setFeedbackForm] = useState({
    type: '',
    title: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedbackHistory] = useState([
    {
      id: '1',
      type: 'academic',
      title: 'Course Content Feedback',
      message: 'The mathematics course is quite challenging but well-structured. However, I would suggest adding more practical examples.',
      status: 'resolved' as const,
      adminResponse: 'Thank you for your feedback. We have discussed this with the faculty and will include more practical examples in upcoming lectures.',
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-12T14:20:00Z'
    },
    {
      id: '2',
      type: 'non-academic',
      title: 'Cafeteria Food Quality',
      message: 'The food quality in the cafeteria has been inconsistent lately. Some days the food is cold and taste is not good.',
      status: 'in-review' as const,
      createdAt: '2024-01-08T16:45:00Z',
      updatedAt: '2024-01-08T16:45:00Z'
    },
    {
      id: '3',
      type: 'app-feedback',
      title: 'App Performance Issue',
      message: 'The mobile app is sometimes slow to load the timetable section. It would be great if this could be optimized.',
      status: 'pending' as const,
      createdAt: '2024-01-05T09:15:00Z',
      updatedAt: '2024-01-05T09:15:00Z'
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.type || !feedbackForm.title || !feedbackForm.message) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Feedback submitted:', feedbackForm);
      setFeedbackForm({ type: '', title: '', message: '' });
      setIsSubmitting(false);
      // In a real app, you would show a success toast here
    }, 2000);
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feedback & Grievance</h1>
        <p className="text-gray-600">Share your feedback and report any issues or concerns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackHistory.length}</div>
            <p className="text-xs text-muted-foreground">Submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {feedbackHistory.filter(f => f.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {feedbackHistory.filter(f => f.status === 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Feedback</CardTitle>
            <CardDescription>Share your thoughts, suggestions, or report issues</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Feedback Type</Label>
                <Select value={feedbackForm.type} onValueChange={(value) => setFeedbackForm({ ...feedbackForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="non-academic">Non-Academic</SelectItem>
                    <SelectItem value="app-feedback">App Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief title for your feedback"
                  value={feedbackForm.title}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your feedback in detail..."
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !feedbackForm.type || !feedbackForm.title || !feedbackForm.message}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback History</CardTitle>
            <CardDescription>Track the status of your submitted feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbackHistory.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
                  <p className="text-gray-600">Submit your first feedback using the form.</p>
                </div>
              ) : (
                feedbackHistory.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{feedback.title}</h4>
                        <p className="text-sm text-gray-600">{getTypeLabel(feedback.type)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(feedback.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                          {feedback.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700">{feedback.message}</p>
                    
                    {feedback.adminResponse && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-sm font-medium text-green-800 mb-1">Admin Response:</p>
                        <p className="text-sm text-green-700">{feedback.adminResponse}</p>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Submitted: {new Date(feedback.createdAt).toLocaleDateString()}
                      {feedback.updatedAt !== feedback.createdAt && (
                        <span> • Updated: {new Date(feedback.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
