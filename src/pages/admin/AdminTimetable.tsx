
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import { ClassSelector } from '../../components/admin/timetable/ClassSelector';
import { TimetableForm } from '../../components/admin/timetable/TimetableForm';
import { TimetableGrid } from '../../components/admin/timetable/TimetableGrid';
import { useTimetable } from '../../hooks/useTimetable';

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

export const AdminTimetable: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('Computer Science');
  const [selectedYear, setSelectedYear] = useState('3');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [selectedSection, setSelectedSection] = useState('A');
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    timetable,
    subjects,
    loading,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry
  } = useTimetable(selectedBranch, selectedYear, selectedSemester, selectedSection);

  const handleAddEntry = (data: Omit<TimetableEntry, 'id'>) => {
    addTimetableEntry(data);
    setShowAddForm(false);
  };

  const handleUpdateEntry = (data: Omit<TimetableEntry, 'id'>) => {
    if (editingEntry) {
      updateTimetableEntry(editingEntry.id, data);
      setEditingEntry(null);
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteTimetableEntry(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
        <p className="text-gray-600">Manage class schedules and time slots</p>
      </div>

      <ClassSelector
        selectedBranch={selectedBranch}
        selectedYear={selectedYear}
        selectedSemester={selectedSemester}
        selectedSection={selectedSection}
        onBranchChange={setSelectedBranch}
        onYearChange={setSelectedYear}
        onSemesterChange={setSelectedSemester}
        onSectionChange={setSelectedSection}
      />

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
                subjects={subjects}
                selectedBranch={selectedBranch}
                selectedYear={selectedYear}
                selectedSemester={selectedSemester}
                selectedSection={selectedSection}
                onSubmit={handleAddEntry}
                onCancel={() => setShowAddForm(false)}
                loading={loading}
              />
            </div>
          )}

          {editingEntry && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50">
              <h3 className="font-medium mb-4">Edit Entry</h3>
              <TimetableForm
                entry={editingEntry}
                subjects={subjects}
                selectedBranch={selectedBranch}
                selectedYear={selectedYear}
                selectedSemester={selectedSemester}
                selectedSection={selectedSection}
                onSubmit={handleUpdateEntry}
                onCancel={() => setEditingEntry(null)}
                loading={loading}
              />
            </div>
          )}

          <TimetableGrid
            timetable={timetable}
            onEdit={setEditingEntry}
            onDelete={handleDeleteEntry}
          />
        </CardContent>
      </Card>
    </div>
  );
};
