
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
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCgpaDialogOpen, setIsCgpaDialogOpen] = useState(false);
  const [editingMark, setEditingMark] = useState<MarksRecord | null>(null);
  const [formData, setFormData] = useState<MarksFormData>({
    subject: '',
    mid1: 0,
    mid2: 0,
    assignment: 0
  });
  const [cgpaFormData, setCgpaFormData] = useState<CGPAData>({ sgpa: 0, cgpa: 0 });
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

  const handleEdit = (mark: MarksRecord) => {
    setEditingMark(mark);
    setFormData({
      subject: mark.subject,
      mid1: mark.mid1,
      mid2: mark.mid2,
      assignment: mark.assignment
    });
    setIsEditDialogOpen(true);
  };

  const handleCgpaEdit = () => {
    setCgpaFormData(cgpaData);
    setIsCgpaDialogOpen(true);
  };

  const handleCgpaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentData) return;

    try {
      const { error } = await supabase
        .from('students')
        .update({
          sgpa: cgpaFormData.sgpa,
          cgpa: cgpaFormData.cgpa
        })
        .eq('profile_id', studentData.profile_id);

      if (error) {
        console.error('Error updating CGPA:', error);
        toast({
          title: "Error",
          description: "Failed to update CGPA",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "CGPA updated successfully",
      });

      setIsCgpaDialogOpen(false);
      fetchCGPAData();
    } catch (error) {
      console.error('Error updating CGPA:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
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
        description: editingMark ? "Marks updated successfully" : "Marks added successfully",
      });

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingMark(null);
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
    percentage: parseFloat(((mark.total / 60) * 100).toFixed(1)) // Total out of 60 (25+25+10)
  }));

  const pieChartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const chartConfig = {
    total: {
      label: "Total Marks",
      color: "hsl(var(--chart-1))",
    },
  };

  // CGPA/SGPA comparison data
  const cgpaComparisonData = [
    { name: 'SGPA', value: cgpaData.sgpa, color: '#0088FE' },
    { name: 'CGPA', value: cgpaData.cgpa, color: '#00C49F' }
  ];

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
    <div className="space-y-6 p-4 max-w-full overflow-hidden">
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

        {/* Edit Marks Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Marks</DialogTitle>
              <DialogDescription>
                Update marks for {editingMark?.subject}. Maximum marks: Mid1 (25), Mid2 (25), Assignment (10)
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subject">Subject</Label>
                <Input
                  id="edit-subject"
                  value={formData.subject}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-mid1">Mid-1 (25)</Label>
                  <Input
                    id="edit-mid1"
                    type="number"
                    min="0"
                    max="25"
                    value={formData.mid1}
                    onChange={(e) => setFormData({...formData, mid1: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mid2">Mid-2 (25)</Label>
                  <Input
                    id="edit-mid2"
                    type="number"
                    min="0"
                    max="25"
                    value={formData.mid2}
                    onChange={(e) => setFormData({...formData, mid2: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-assignment">Assignment (10)</Label>
                  <Input
                    id="edit-assignment"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.assignment}
                    onChange={(e) => setFormData({...formData, assignment: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Marks</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* CGPA Edit Dialog */}
        <Dialog open={isCgpaDialogOpen} onOpenChange={setIsCgpaDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update CGPA</DialogTitle>
              <DialogDescription>
                Enter your current semester SGPA and cumulative CGPA
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCgpaSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sgpa">SGPA</Label>
                  <Input
                    id="sgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpaFormData.sgpa}
                    onChange={(e) => setCgpaFormData({...cgpaFormData, sgpa: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpaFormData.cgpa}
                    onChange={(e) => setCgpaFormData({...cgpaFormData, cgpa: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCgpaDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update CGPA</Button>
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
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <Button size="sm" variant="ghost" onClick={handleCgpaEdit}>
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
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

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marks Pie Chart */}
        {marks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Distribution of marks across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="total"
                      label={({ subject, total }) => `${subject}: ${total}`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* CGPA vs SGPA Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>GPA Analysis</CardTitle>
            <CardDescription>CGPA vs SGPA performance comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cgpaComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0].value;
                        const name = payload[0].payload.name;
                        return (
                          <div className="bg-background p-2 border rounded shadow">
                            <p className="font-medium">{name}</p>
                            <p className="text-sm">{`Value: ${typeof value === 'number' ? value.toFixed(2) : value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: "#8884d8", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Marks */}
      {marks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
            <CardDescription>Detailed breakdown of your marks (Total out of 60)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {marks.map((mark) => {
                    const percentage = (mark.total / 60) * 100; // Total out of 60
                    const grade = calculateGrade(percentage);
                    return (
                      <Card key={mark.id} className="border hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-sm">{mark.subject}</CardTitle>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(mark)}>
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-medium">Mid-1</div>
                              <div className="text-blue-600">{mark.mid1}/25</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">Mid-2</div>
                              <div className="text-green-600">{mark.mid2}/25</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">Assign</div>
                              <div className="text-purple-600">{mark.assignment}/10</div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{mark.total}/60</div>
                            <div className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className={getGradeColor(grade)}>{grade}</Badge>
                            <Progress value={percentage} className="w-16 h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
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
