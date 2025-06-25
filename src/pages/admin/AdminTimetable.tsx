import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calendar, Plus, Edit, Trash2, Clock } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../components/ui/use-toast';

interface TimetableEntry {
  id: string;
  day_of_week: string;
  time_slot: string;
  subject: string;
  branch: string;
  year: number;
  semester: number;
  section: string;
}

const defaultSubjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'Computer Science',
  'Data Structures',
  'Algorithms',
  'Database Systems',
  'Operating Systems',
  'Software Engineering',
  'Web Development',
  'Machine Learning',
  'Computer Networks',
  'Digital Electronics',
  'Microprocessors'
];

export const AdminTimetable: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedSection, setSelectedSection] = useState('A');
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [subjects, setSubjects] = useState<string[]>(defaultSubjects);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTimetable();
    fetchSubjects();
  }, [selectedBranch, selectedYear, selectedSemester, selectedSection]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_subjects_for_class', {
          p_branch: selectedBranch,
          p_year: parseInt(selectedYear),
          p_semester: parseInt(selectedSemester)
        });

      if (error) {
        console.error('Error fetching subjects:', error);
        setSubjects(defaultSubjects);
        return;
      }

      const subjectNames = data?.map((s: any) => s.name) || [];
      // Combine database subjects with default subjects
      const allSubjects = [...new Set([...subjectNames, ...defaultSubjects])];
      setSubjects(allSubjects);
    } catch (error) {
      console.error('Error in fetchSubjects:', error);
      setSubjects(defaultSubjects);
    }
  };

  const fetchTimetable = async () => {
    try {
      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .eq('branch', selectedBranch)
        .eq('year', parseInt(selectedYear))
        .eq('semester', parseInt(selectedSemester))
        .eq('section', selectedSection)
        .order('day_of_week')
        .order('time_slot');

      if (error) {
        console.error('Error fetching timetable:', error);
        return;
      }

      setTimetable(data || []);
    } catch (error) {
      console.error('Error in fetchTimetable:', error);
    }
  };

  const addTimetableEntry = async (entry: Omit<TimetableEntry, 'id'>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('timetables')
        .insert({
          ...entry,
          branch: selectedBranch,
          year: parseInt(selectedYear),
          semester: parseInt(selectedSemester),
          section: selectedSection
        });

      if (error) {
        console.error('Error adding timetable entry:', error);
        toast({
          title: "Error",
          description: "Failed to add timetable entry",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Timetable entry added successfully",
      });
      
      fetchTimetable();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error in addTimetableEntry:', error);
      toast({
        title: "Error",
        description: "Failed to add timetable entry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTimetableEntry = async (id: string, updates: Partial<TimetableEntry>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('timetables')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating timetable entry:', error);
        toast({
          title: "Error",
          description: "Failed to update timetable entry",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Timetable entry updated successfully",
      });
      
      fetchTimetable();
      setEditingEntry(null);
    } catch (error) {
      console.error('Error in updateTimetableEntry:', error);
      toast({
        title: "Error",
        description: "Failed to update timetable entry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTimetableEntry = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('timetables')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting timetable entry:', error);
        toast({
          title: "Error",
          description: "Failed to delete timetable entry",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Timetable entry deleted successfully",
      });
      
      fetchTimetable();
    } catch (error) {
      console.error('Error in deleteTimetableEntry:', error);
      toast({
        title: "Error",
        description: "Failed to delete timetable entry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const TimetableForm = ({ entry, onSubmit, onCancel }: {
    entry?: TimetableEntry;
    onSubmit: (data: Omit<TimetableEntry, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      day_of_week: entry?.day_of_week || 'Monday',
      time_slot: entry?.time_slot || '',
      subject: entry?.subject || subjects[0] || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        branch: selectedBranch,
        year: parseInt(selectedYear),
        semester: parseInt(selectedSemester),
        section: selectedSection
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={formData.day_of_week} onValueChange={(value) => setFormData({...formData, day_of_week: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek.map(day => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Time Slot (e.g., 9:00-10:00)"
            value={formData.time_slot}
            onChange={(e) => setFormData({...formData, time_slot: e.target.value})}
            required
          />

          <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>
            {entry ? 'Update' : 'Add'} Entry
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const groupedTimetable = daysOfWeek.reduce((acc, day) => {
    acc[day] = timetable.filter(entry => entry.day_of_week === day);
    return acc;
  }, {} as Record<string, TimetableEntry[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
        <p className="text-gray-600">Manage class schedules and time slots</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
          <CardDescription>Choose the class to manage timetable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
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
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
                <SelectItem value="D">Section D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Timetable</CardTitle>
              <CardDescription>
                {selectedBranch} Year {selectedYear} Semester {selectedSemester} Section {selectedSection}
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-4">Add New Entry</h3>
              <TimetableForm
                onSubmit={addTimetableEntry}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          {editingEntry && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50">
              <h3 className="font-medium mb-4">Edit Entry</h3>
              <TimetableForm
                entry={editingEntry}
                onSubmit={(data) => updateTimetableEntry(editingEntry.id, data)}
                onCancel={() => setEditingEntry(null)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {daysOfWeek.map(day => (
              <Card key={day}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {day}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {groupedTimetable[day]?.length > 0 ? (
                      groupedTimetable[day].map(entry => (
                        <div key={entry.id} className="p-3 border rounded-lg bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-3 w-3 mr-1" />
                                {entry.time_slot}
                              </div>
                              <div className="font-medium text-gray-900">{entry.subject}</div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingEntry(entry)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteTimetableEntry(entry.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No classes scheduled
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
