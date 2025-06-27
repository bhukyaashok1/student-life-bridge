
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, BookOpen, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { AcademicChatbot } from '../../components/student/AcademicChatbot';

interface MarkRecord {
  id: string;
  subject: string;
  mid1: number;
  mid2: number;
  assignment: number;
  total: number;
}

interface CGPAData {
  semester: number;
  sgpa: number;
  cgpa: number;
}

export const StudentMarks: React.FC = () => {
  const { studentData, loading: authLoading } = useAuth();
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [cgpaData, setCgpaData] = useState<CGPAData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (studentData && !authLoading) {
      fetchMarks();
      fetchCGPAData();
    }
  }, [studentData, authLoading]);

  const fetchMarks = async () => {
    if (!studentData) return;

    try {
      setLoading(true);
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', studentData.id)
        .single();

      if (studentError || !studentRecord) {
        console.error('Error fetching student record:', studentError);
        setError('Failed to fetch student data');
        return;
      }

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

      setMarks(marksData || []);
    } catch (error) {
      console.error('Error in fetchMarks:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCGPAData = async () => {
    if (!studentData) return;

    try {
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .select('sgpa, cgpa')
        .eq('profile_id', studentData.id)
        .single();

      if (studentError || !studentRecord) {
        console.error('Error fetching CGPA data:', studentError);
        return;
      }

      // Generate sample CGPA progression data (in real app, this should come from database)
      const sampleCGPAData = [];
      for (let sem = 1; sem <= studentData.semester; sem++) {
        sampleCGPAData.push({
          semester: sem,
          sgpa: sem === studentData.semester ? parseFloat(String(studentRecord.sgpa || '0')) : Math.random() * 2 + 7,
          cgpa: sem === studentData.semester ? parseFloat(String(studentRecord.cgpa || '0')) : Math.random() * 1.5 + 7.5
        });
      }
      
      setCgpaData(sampleCGPAData);
    } catch (error) {
      console.error('Error fetching CGPA data:', error);
    }
  };

  const getGradeFromMarks = (total: number): string => {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B+';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 40) return 'D';
    return 'F';
  };

  const getGradeColor = (grade: string): string => {
    const colors: Record<string, string> = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-700',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-700',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  const averageMarks = marks.length > 0 
    ? marks.reduce((sum, mark) => sum + mark.total, 0) / marks.length 
    : 0;

  const currentSGPA = cgpaData.length > 0 ? cgpaData[cgpaData.length - 1]?.sgpa || 0 : 0;
  const currentCGPA = cgpaData.length > 0 ? cgpaData[cgpaData.length - 1]?.cgpa || 0 : 0;

  const chartConfig = {
    sgpa: {
      label: "SGPA",
      color: "hsl(var(--chart-1))",
    },
    cgpa: {
      label: "CGPA",
      color: "hsl(var(--chart-2))",
    },
  };

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marks & Performance</h1>
          <p className="text-gray-600">Loading your academic performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marks & Performance</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marks & Performance</h1>
          <p className="text-gray-600">Unable to load student data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-32">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marks & Performance</h1>
        <p className="text-gray-600">
          {studentData.branch} - Year {studentData.year}, Semester {studentData.semester}
        </p>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current SGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMarks.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Current semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marks.length}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      {/* CGPA/SGPA Analysis Charts */}
      {cgpaData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>SGPA & CGPA Progression</CardTitle>
              <CardDescription>Track your academic performance over semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cgpaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="sgpa" 
                      stroke="var(--color-sgpa)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-sgpa)" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cgpa" 
                      stroke="var(--color-cgpa)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-cgpa)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>Current semester marks breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="subject" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="var(--color-sgpa)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subject-wise Marks Table */}
      {marks.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Marks</CardTitle>
            <CardDescription>Detailed breakdown of your performance in each subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Subject</th>
                    <th className="text-center p-2">Mid-1</th>
                    <th className="text-center p-2">Mid-2</th>
                    <th className="text-center p-2">Assignment</th>
                    <th className="text-center p-2">Total</th>
                    <th className="text-center p-2">Grade</th>
                    <th className="text-center p-2">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((mark) => {
                    const grade = getGradeFromMarks(mark.total);
                    return (
                      <tr key={mark.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{mark.subject}</td>
                        <td className="text-center p-2">{mark.mid1}</td>
                        <td className="text-center p-2">{mark.mid2}</td>
                        <td className="text-center p-2">{mark.assignment}</td>
                        <td className="text-center p-2 font-bold">{mark.total.toFixed(1)}</td>
                        <td className="text-center p-2">
                          <Badge className={getGradeColor(grade)}>
                            {grade}
                          </Badge>
                        </td>
                        <td className="text-center p-2">
                          <Progress value={mark.total} className="w-20" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Marks Available</CardTitle>
            <CardDescription>
              No marks have been published for this semester yet. Please check back later.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>Insights about your academic progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Strengths</h4>
              <ul className="space-y-2">
                {marks.filter(m => m.total >= 80).map(mark => (
                  <li key={mark.id} className="flex items-center text-green-700">
                    <Award className="h-4 w-4 mr-2" />
                    Excellent in {mark.subject} ({mark.total.toFixed(1)}%)
                  </li>
                ))}
                {marks.filter(m => m.total >= 80).length === 0 && (
                  <li className="text-gray-500">Work on improving your scores to identify strengths</li>
                )}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Areas for Improvement</h4>
              <ul className="space-y-2">
                {marks.filter(m => m.total < 70).map(mark => (
                  <li key={mark.id} className="flex items-center text-orange-700">
                    <Target className="h-4 w-4 mr-2" />
                    Focus on {mark.subject} ({mark.total.toFixed(1)}%)
                  </li>
                ))}
                {marks.filter(m => m.total < 70).length === 0 && (
                  <li className="text-green-700">Great job! Keep up the good work!</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Chatbot */}
      <AcademicChatbot 
        currentSGPA={currentSGPA}
        currentCGPA={currentCGPA}
        marks={marks}
        semester={studentData.semester}
      />
    </div>
  );
};
