
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface TimetableFormProps {
  entry?: {
    id: string;
    day_of_week: string;
    time_slot: string;
    subject: string;
    branch: string;
    year: number;
    semester: number;
    section: string;
  };
  subjects: string[];
  selectedBranch: string;
  selectedYear: string;
  selectedSemester: string;
  selectedSection: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TimetableForm: React.FC<TimetableFormProps> = ({
  entry,
  subjects,
  selectedBranch,
  selectedYear,
  selectedSemester,
  selectedSection,
  onSubmit,
  onCancel,
  loading
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
