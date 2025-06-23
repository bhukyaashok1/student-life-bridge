
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import { useToast } from '../../components/ui/use-toast';

interface TimetableEntry {
  id?: string;
  day_of_week: string;
  time_slot: string;
  subject: string;
}

export const AdminTimetable: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [selectedSection, setSelectedSection] = useState('A');
  const [timetable, setTimetable] = useState<Record<string, TimetableEntry[]>>({});
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{day: string, index: number} | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [editingTimeSlot, setEditingTimeSlot] = useState<{day: string, index: number} | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const { toast } = useToast();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTimetable();
    fetchSubjects();
  }, [selectedBranch, selectedYear, selectedSemester, selectedSection]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('name')
        .eq('branch', selectedBranch)
        .eq('year', parseInt(selectedYear))
        .eq('semester', parseInt(selectedSemester));

      if (error) {
        console.error('Error fetching subjects:', error);
        return;
      }

      const subjectNames = [...new Set(data?.map(s => s.name) || [])];
      setSubjects(subjectNames);
    } catch (error) {
      console.error('Error in fetchSubjects:', error);
    }
  };

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .eq('branch', selectedBranch)
        .eq('year', parseInt(selectedYear))
        .eq('semester', parseInt(selectedSemester))
        .eq('section', selectedSection);

      if (error) {
        console.error('Error fetching timetable:', error);
        return;
      }

      // Initialize empty timetable structure
      const newTimetable: Record<string, TimetableEntry[]> = {};
      days.forEach(day => {
        newTimetable[day] = data?.filter(item => item.day_of_week === day).sort((a, b) => a.time_slot.localeCompare(b.time_slot)) || [];
      });

      setTimetable(newTimetable);
    } catch (error) {
      console.error('Error in fetchTimetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (day: string, slotIndex: number, subject: string) => {
    const slot = timetable[day][slotIndex];
    
    try {
      if (slot.id) {
        // Update existing entry
        const { error } = await supabase
          .from('timetables')
          .update({ subject })
          .eq('id', slot.id);

        if (error) {
          console.error('Error updating timetable:', error);
          toast({
            title: "Error",
            description: "Failed to update subject",
            variant: "destructive",
          });
          return;
        }
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('timetables')
          .insert({
            branch: selectedBranch,
            year: parseInt(selectedYear),
            semester: parseInt(selectedSemester),
            section: selectedSection,
            day_of_week: day,
            time_slot: slot.time_slot,
            subject
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating timetable entry:', error);
          toast({
            title: "Error",
            description: "Failed to create timetable entry",
            variant: "destructive",
          });
          return;
        }

        // Update local state with the new ID
        setTimetable(prev => ({
          ...prev,
          [day]: prev[day].map((item, index) => 
            index === slotIndex ? { ...item, id: data.id, subject } : item
          )
        }));
      }

      // Update local state
      setTimetable(prev => ({
        ...prev,
        [day]: prev[day].map((item, index) => 
          index === slotIndex ? { ...item, subject } : item
        )
      }));

      setEditingSlot(null);
      setNewSubject('');
      
      toast({
        title: "Success",
        description: "Subject updated successfully",
      });
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  const updateTimeSlot = async (day: string, slotIndex: number, timeSlot: string) => {
    const slot = timetable[day][slotIndex];
    
    try {
      if (slot.id) {
        const { error } = await supabase
          .from('timetables')
          .update({ time_slot: timeSlot })
          .eq('id', slot.id);

        if (error) {
          console.error('Error updating time slot:', error);
          toast({
            title: "Error",
            description: "Failed to update time slot",
            variant: "destructive",
          });
          return;
        }

        // Update local state
        setTimetable(prev => ({
          ...prev,
          [day]: prev[day].map((item, index) => 
            index === slotIndex ? { ...item, time_slot: timeSlot } : item
          )
        }));

        toast({
          title: "Success",
          description: "Time slot updated successfully",
        });
      }

      setEditingTimeSlot(null);
      setNewTimeSlot('');
    } catch (error) {
      console.error('Error updating time slot:', error);
    }
  };

  const addTimeSlot = (day: string) => {
    const newSlot = `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:00-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:00`;
    setTimetable(prev => ({
      ...prev,
      [day]: [...prev[day], { day_of_week: day, time_slot: newSlot, subject: "Free Period" }]
    }));
  };

  const removeTimeSlot = async (day: string, slotIndex: number) => {
    const slot = timetable[day][slotIndex];
    
    try {
      if (slot.id) {
        const { error } = await supabase
          .from('timetables')
          .delete()
          .eq('id', slot.id);

        if (error) {
          console.error('Error deleting timetable entry:', error);
          toast({
            title: "Error",
            description: "Failed to delete time slot",
            variant: "destructive",
          });
          return;
        }
      }

      setTimetable(prev => ({
        ...prev,
        [day]: prev[day].filter((_, index) => index !== slotIndex)
      }));

      toast({
        title: "Success",
        description: "Time slot deleted successfully",
      });
    } catch (error) {
      console.error('Error removing time slot:', error);
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Physics': 'bg-green-100 text-green-800 border-green-200',
      'Chemistry': 'bg-purple-100 text-purple-800 border-purple-200',
      'English': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Computer Science': 'bg-red-100 text-red-800 border-red-200',
      'Electronics': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Mechanical': 'bg-orange-100 text-orange-800 border-orange-200',
      'Free Period': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
        <p className="text-gray-600">Create and manage class timetables</p>
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
                <SelectItem value="Electrical">Electrical</SelectItem>
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
                <SelectItem value="3">Semester 3</SelectItem>
                <SelectItem value="4">Semester 4</SelectItem>
                <SelectItem value="5">Semester 5</SelectItem>
                <SelectItem value="6">Semester 6</SelectItem>
                <SelectItem value="7">Semester 7</SelectItem>
                <SelectItem value="8">Semester 8</SelectItem>
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Timetable Editor</CardTitle>
              <CardDescription>
                {selectedBranch} Year {selectedYear} Semester {selectedSemester} Section {selectedSection}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading timetable...</div>
          ) : (
            <div className="space-y-6">
              {days.map(day => (
                <div key={day} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{day}</h3>
                    <Button size="sm" variant="outline" onClick={() => addTimeSlot(day)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Slot
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {timetable[day]?.map((slot, index) => (
                      <div key={index} className={`p-3 rounded border ${getSubjectColor(slot.subject)}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {editingTimeSlot?.day === day && editingTimeSlot?.index === index ? (
                                <div className="space-y-2">
                                  <Input
                                    value={newTimeSlot}
                                    onChange={(e) => setNewTimeSlot(e.target.value)}
                                    placeholder="e.g., 09:00-10:00"
                                    className="h-6 text-xs"
                                  />
                                  <div className="flex space-x-1">
                                    <Button size="sm" onClick={() => updateTimeSlot(day, index, newTimeSlot)}>
                                      Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingTimeSlot(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <span 
                                  className="cursor-pointer hover:underline"
                                  onClick={() => {
                                    setEditingTimeSlot({ day, index });
                                    setNewTimeSlot(slot.time_slot);
                                  }}
                                >
                                  {slot.time_slot}
                                </span>
                              )}
                            </div>
                            {editingSlot?.day === day && editingSlot?.index === index ? (
                              <div className="mt-2 space-y-2">
                                <Select value={newSubject} onValueChange={setNewSubject}>
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Select subject" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {subjects.map(subject => (
                                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                    ))}
                                    <SelectItem value="Free Period">Free Period</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="flex space-x-1">
                                  <Button size="sm" onClick={() => updateSubject(day, index, newSubject)}>
                                    Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingSlot(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm mt-1">{slot.subject}</div>
                            )}
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingSlot({ day, index });
                                setNewSubject(slot.subject);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTimeSlot(day, index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
