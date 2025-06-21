
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Calendar, Clock, Save, Plus, Edit, Trash2 } from 'lucide-react';

export const AdminTimetable: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [selectedSection, setSelectedSection] = useState('A');

  const [timetable, setTimetable] = useState({
    Monday: [
      { timeSlot: "09:00-10:00", subject: "Mathematics" },
      { timeSlot: "10:00-11:00", subject: "Physics" },
      { timeSlot: "11:30-12:30", subject: "Chemistry" },
      { timeSlot: "01:30-02:30", subject: "English" },
      { timeSlot: "02:30-03:30", subject: "Computer Science" },
    ],
    Tuesday: [
      { timeSlot: "09:00-10:00", subject: "Physics Lab" },
      { timeSlot: "10:00-11:00", subject: "Physics Lab" },
      { timeSlot: "11:30-12:30", subject: "Mathematics" },
      { timeSlot: "01:30-02:30", subject: "Chemistry" },
      { timeSlot: "02:30-03:30", subject: "English" },
    ],
    Wednesday: [
      { timeSlot: "09:00-10:00", subject: "Computer Science" },
      { timeSlot: "10:00-11:00", subject: "Mathematics" },
      { timeSlot: "11:30-12:30", subject: "Physics" },
      { timeSlot: "01:30-02:30", subject: "Chemistry Lab" },
      { timeSlot: "02:30-03:30", subject: "Chemistry Lab" },
    ],
    Thursday: [
      { timeSlot: "09:00-10:00", subject: "English" },
      { timeSlot: "10:00-11:00", subject: "Computer Science" },
      { timeSlot: "11:30-12:30", subject: "Mathematics" },
      { timeSlot: "01:30-02:30", subject: "Physics" },
      { timeSlot: "02:30-03:30", subject: "Chemistry" },
    ],
    Friday: [
      { timeSlot: "09:00-10:00", subject: "Computer Science Lab" },
      { timeSlot: "10:00-11:00", subject: "Computer Science Lab" },
      { timeSlot: "11:30-12:30", subject: "Physics" },
      { timeSlot: "01:30-02:30", subject: "Mathematics" },
      { timeSlot: "02:30-03:30", subject: "English" },
    ],
    Saturday: [
      { timeSlot: "09:00-10:00", subject: "Tutorial - Math" },
      { timeSlot: "10:00-11:00", subject: "Tutorial - Physics" },
      { timeSlot: "11:30-12:30", subject: "Tutorial - Chemistry" },
    ],
  });

  const [editingSlot, setEditingSlot] = useState<{day: string, index: number} | null>(null);
  const [newSubject, setNewSubject] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ["09:00-10:00", "10:00-11:00", "11:30-12:30", "01:30-02:30", "02:30-03:30"];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Physics Lab', 'Chemistry Lab', 'Computer Science Lab'];

  const updateSubject = (day: string, slotIndex: number, subject: string) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day as keyof typeof prev].map((slot, index) => 
        index === slotIndex ? { ...slot, subject } : slot
      )
    }));
    setEditingSlot(null);
    setNewSubject('');
  };

  const addTimeSlot = (day: string) => {
    const newTimeSlot = `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:00-${String(Math.floor(Math.random() * 12) + 2).padStart(2, '0')}:00`;
    setTimetable(prev => ({
      ...prev,
      [day]: [...prev[day as keyof typeof prev], { timeSlot: newTimeSlot, subject: "Free Period" }]
    }));
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day as keyof typeof prev].filter((_, index) => index !== slotIndex)
    }));
  };

  const saveTimetable = () => {
    console.log('Saving timetable:', {
      branch: selectedBranch,
      year: selectedYear,
      semester: selectedSemester,
      section: selectedSection,
      timetable
    });
    // In a real app, this would save to the database
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
      'Physics': 'bg-green-100 text-green-800 border-green-200',
      'Chemistry': 'bg-purple-100 text-purple-800 border-purple-200',
      'English': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Computer Science': 'bg-red-100 text-red-800 border-red-200',
      'Physics Lab': 'bg-green-200 text-green-900 border-green-300',
      'Chemistry Lab': 'bg-purple-200 text-purple-900 border-purple-300',
      'Computer Science Lab': 'bg-red-200 text-red-900 border-red-300',
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
            <Button onClick={saveTimetable}>
              <Save className="h-4 w-4 mr-2" />
              Save Timetable
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                  {timetable[day as keyof typeof timetable].map((slot, index) => (
                    <div key={index} className={`p-3 rounded border ${getSubjectColor(slot.subject)}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{slot.timeSlot}</div>
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
        </CardContent>
      </Card>
    </div>
  );
};
