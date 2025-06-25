
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';

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

interface TimetableGridProps {
  timetable: TimetableEntry[];
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (id: string) => void;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  timetable,
  onEdit,
  onDelete
}) => {
  const groupedTimetable = daysOfWeek.reduce((acc, day) => {
    acc[day] = timetable.filter(entry => entry.day_of_week === day);
    return acc;
  }, {} as Record<string, TimetableEntry[]>);

  return (
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
                          onClick={() => onEdit(entry)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(entry.id)}
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
  );
};
