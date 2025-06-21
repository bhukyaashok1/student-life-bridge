
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Clock, Calendar } from 'lucide-react';

export const StudentTimetable: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');

  const timetableData = {
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
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ["09:00-10:00", "10:00-11:00", "11:30-12:30", "01:30-02:30", "02:30-03:30"];

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
      'Tutorial - Math': 'bg-blue-50 text-blue-700 border-blue-100',
      'Tutorial - Physics': 'bg-green-50 text-green-700 border-green-100',
      'Tutorial - Chemistry': 'bg-purple-50 text-purple-700 border-purple-100',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">Your weekly class schedule</p>
        </div>
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Week</SelectItem>
            <SelectItem value="next">Next Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Classes scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mathematics</div>
            <p className="text-xs text-muted-foreground">09:00 - 10:00 AM</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
          <CardDescription>Your complete weekly schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="font-semibold text-center p-2 bg-gray-50 rounded">Time</div>
                {days.map(day => (
                  <div key={day} className="font-semibold text-center p-2 bg-gray-50 rounded">
                    {day}
                  </div>
                ))}
              </div>
              
              {timeSlots.map(timeSlot => (
                <div key={timeSlot} className="grid grid-cols-7 gap-2 mb-2">
                  <div className="text-sm font-medium p-2 bg-gray-100 rounded text-center">
                    {timeSlot}
                  </div>
                  {days.map(day => {
                    const daySchedule = timetableData[day as keyof typeof timetableData];
                    const classItem = daySchedule?.find(item => item.timeSlot === timeSlot);
                    
                    return (
                      <div key={`${day}-${timeSlot}`} className="min-h-[50px]">
                        {classItem ? (
                          <div className={`p-2 rounded border text-xs font-medium text-center ${getSubjectColor(classItem.subject)}`}>
                            {classItem.subject}
                          </div>
                        ) : (
                          <div className="p-2 border border-gray-200 rounded bg-gray-50 text-center text-xs text-gray-400">
                            Free
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Schedule Overview</CardTitle>
          <CardDescription>Subject-wise class distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science'].map(subject => {
              const totalClasses = Object.values(timetableData).flat().filter(item => 
                item.subject.includes(subject.split(' ')[0])
              ).length;
              
              return (
                <div key={subject} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">{subject}</div>
                  <div className="text-xl font-bold">{totalClasses}</div>
                  <div className="text-xs text-gray-500">classes/week</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
