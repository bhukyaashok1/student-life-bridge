
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface ClassSelectorProps {
  selectedBranch: string;
  selectedYear: string;
  selectedSemester: string;
  selectedSection: string;
  onBranchChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onSectionChange: (value: string) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selectedBranch,
  selectedYear,
  selectedSemester,
  selectedSection,
  onBranchChange,
  onYearChange,
  onSemesterChange,
  onSectionChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Class</CardTitle>
        <CardDescription>Choose the class to manage timetable</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={selectedBranch} onValueChange={onBranchChange}>
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

          <Select value={selectedYear} onValueChange={onYearChange}>
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

          <Select value={selectedSemester} onValueChange={onSemesterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="2">Semester 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSection} onValueChange={onSectionChange}>
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
  );
};
