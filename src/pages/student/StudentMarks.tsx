
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { TrendingUp, BookOpen, Plus, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

interface MarksRecord {
  id: string;
  subject: string;
  mid1: number;
  mid2: number;
  assignment: number;
  total: number;
}

interface CGPAData {
  sgpa: number;
  cgpa: number;
}

interface MarksFormData {
  subject: string;
  mid1: number;
  mid2: number;
  assignment: number;
}

export const StudentMarks: React.FC = () => {
  const { studentData, loading: authLoading } = useAuth();
  const [marks, setMarks] = useState<MarksRecord[]>([]);
  const [cgpaData, setCgpaData] = useState<CGPAData>({ sgpa: 0, cgpa: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<MarksFormData>({
    subject: '',
    mid1: 0,
    mid2: 0,
    assignment: 0
  });
  const { toast } = useToast();

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science',
    'Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems',
    'Web Development', 'Machine Learning', 'Computer Networks'
  ];

  console.log('StudentMarks - studentData:', studentData);

  useEffect(() => {
    if (studentData && !authLoading) {
      fetchMarksData();
      fetchCGPAData();
    }
  }, [studentData, authLoading]);

  const fetchMarksData = async () => {
    if (!studentData) return;

    try {
      setLoading(true);
      
      console.log('Fetching student record for profile_id:', studentData.profile_id);

      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', studentData.profile_id)
        .single();

      if (studentError) {
        console.error('Error fetching student record:', studentError);
        setError('Failed to fetch student data');
        return;
      }

      if (!studentRecord) {
        console.log('No student record found');
        setMarks([]);
        setError(null);
        return;
      }

      console.log('Found student record:', studentRecord);

      const { data: marksData, error: marksError } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', studentRecord.id)
        .eq('semester', studentData.semester);

      if (marksError) {
        console.error('Error fetching marks:', marksError);
        setError('Failed to fetch marks data');
        return;
      }

      console.log('Fetched marks data:', marksData);
      setMarks(marksData || []);
      setError(null);
    } catch (error) {
      console.error('Error in fetchMarksData:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCGPAData = async () => {
    if (!studentData) return;

    try {
      console.log('Fetching CGPA data for profile_id:', studentData.profile_id);

      const { data, error } = await supabase
        .from('students')
        .select('sgpa, cgpa')
        .eq('profile_id', studentData.profile_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching CGPA data:', error);
        return;
      }

      console.log('Fetched CGPA data:', data);

      setCgpaData({
        sgpa: data?.sgpa || 0,
        cgpa: data?.cgpa || 0
      });
    } catch (error) {
      console.error('Error fetching CGPA data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentData || !formData.subject) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Adding marks for:', formData);

      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', studentData.profile_id)
        .single();

      if (studentError || !studentRecord) {
        console.error('Student error or no record:', studentError);
        toast({
          title: "Error",
          description: "Student record not found",
          variant: "destructive"
        });
        return;
      }

      console.log('Inserting marks for student:', studentRecord.id);

      const { error } = await supabase
        .from('marks')
        .upsert({
          student_id: studentRecord.id,
          subject: formData.subject,
          branch: studentData.branch,
          year: studentData.year,
          semester: studentData.semester,
          section: studentData.section,
          mid1: formData.mid1,
          mid2: formData.mid2,
          assignment: formData.assignment
        }, {
          onConflict: 'student_id,subject,semester'
        });

      if (error) {
        console.error('Error saving marks:', error);
        toast({
          title: "Error",
          description: "Failed to save marks: " + error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Marks added successfully",
      });

      setIsAddDialogOpen(false);
      setFormData({ subject: '', mid1: 0, mid2: 0, assignment: 0 });
      fetchMarksData();
    } catch (error) {
      console.error('Error saving marks:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const calculateGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const chartData = marks.map(mark => ({
    subject: mark.subject,
    total: mark.total,
    percentage: ((mark.total / 60) * 100).toFixed(1) // Total out of 60 (25+25+10)
  }));

  const chartConfig = {
    total: {
      label: "Total Marks",
      color: "hsl(var(--chart-1))",
    },
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Performance</h1>
          <p className="text-gray-600">Loading your academic data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Performance</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Performance</h1>
          <p className="text-gray-600">Unable to load student data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Performance</h1>
          <p className="text-gray-600">
            {studentData.branch} - Year {studentData.year}, Semester {studentData.semester}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Marks
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Marks</DialogTitle>
              <DialogDescription>
                Enter your marks for a subject. Maximum marks: Mid1 (25), Mid2 (25), Assignment (10)
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mid1">Mid-1 (25)</Label>
                  <Input
                    id="mid1"
                    type="number"
                    min="0"
                    max="25"
                    value={formData.mid1}
                    onChange={(e) => setFormData({...formData, mid1: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mid2">Mid-2 (25)</Label>
                  <Input
                    id="mid2"
                    type="number"
                    min="0"
                    max="25"
                    value={formData.mid2}
                    onChange={(e) => setFormData({...formData, mid2: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignment">Assignment (10)</Label>
                  <Input
                    id="assignment"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.assignment}
                    onChange={(e) => setFormData({...formData, assignment: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Marks</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* CGPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cgpaData.cgpa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Cumulative Grade Point Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SGPA</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cgpaData.sgpa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Semester Grade Point Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marks.length}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Marks Chart */}
      {marks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your marks across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Subject-wise Marks */}
      {marks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
            <CardDescription>Detailed breakdown of your marks (Total out of 60)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Subject</th>
                    <th className="text-center p-2">Mid-1 (25)</th>
                    <th className="text-center p-2">Mid-2 (25)</th>
                    <th className="text-center p-2">Assignment (10)</th>
                    <th className="text-center p-2">Total (60)</th>
                    <th className="text-center p-2">Percentage</th>
                    <th className="text-center p-2">Grade</th>
                    <th className="text-center p-2">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((mark) => {
                    const percentage = (mark.total / 60) * 100; // Total out of 60
                    const grade = calculateGrade(percentage);
                    return (
                      <tr key={mark.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{mark.subject}</td>
                        <td className="text-center p-2">{mark.mid1}</td>
                        <td className="text-center p-2">{mark.mid2}</td>
                        <td className="text-center p-2">{mark.assignment}</td>
                        <td className="text-center p-2 font-bold">{mark.total}</td>
                        <td className="text-center p-2">{percentage.toFixed(1)}%</td>
                        <td className="text-center p-2">
                          <Badge className={getGradeColor(grade)}>
                            {grade}
                          </Badge>
                        </td>
                        <td className="text-center p-2">
                          <Progress value={percentage} className="w-20" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No marks message */}
      {marks.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Marks Records</CardTitle>
            <CardDescription>
              No marks have been recorded for this semester yet. Click "Add Marks" to enter your marks manually.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
