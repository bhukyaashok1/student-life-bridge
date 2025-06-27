
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../components/ui/use-toast';

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

export const useTimetable = (branch: string, year: string, semester: string, section: string) => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [subjects, setSubjects] = useState<string[]>(defaultSubjects);
  const [validTimeSlots, setValidTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get valid time slots based on year
  const getValidTimeSlots = (yearNum: number): string[] => {
    if (yearNum === 1) {
      return ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-12:40', '12:40-01:40', '01:40-02:40', '02:40-03:40'];
    } else {
      return ['10:00-11:00', '11:00-12:00', '12:00-01:00', '01:00-01:40', '01:40-02:40', '02:40-03:40', '03:40-04:40'];
    }
  };

  useEffect(() => {
    const timeSlots = getValidTimeSlots(parseInt(year));
    setValidTimeSlots(timeSlots);
    fetchTimetable();
    fetchSubjects();
  }, [branch, year, semester, section]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_subjects_for_class', {
          p_branch: branch,
          p_year: parseInt(year),
          p_semester: parseInt(semester)
        });

      if (error) {
        console.error('Error fetching subjects:', error);
        setSubjects(defaultSubjects);
        return;
      }

      const subjectNames = data?.map((s: any) => s.name) || [];
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
        .rpc('get_timetable_for_class', {
          p_branch: branch,
          p_year: parseInt(year),
          p_semester: parseInt(semester),
          p_section: section
        });

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
      // Validate time slot
      const yearNum = parseInt(year);
      const validSlots = getValidTimeSlots(yearNum);
      
      if (!validSlots.includes(entry.time_slot)) {
        toast({
          title: "Invalid Time Slot",
          description: `Time slot ${entry.time_slot} is not valid for Year ${yearNum}. Valid slots: ${validSlots.join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('timetables')
        .insert(entry);

      if (error) {
        console.error('Error adding timetable entry:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to add timetable entry",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Timetable entry added successfully",
      });
      
      fetchTimetable();
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
      // Validate time slot if it's being updated
      if (updates.time_slot) {
        const yearNum = parseInt(year);
        const validSlots = getValidTimeSlots(yearNum);
        
        if (!validSlots.includes(updates.time_slot)) {
          toast({
            title: "Invalid Time Slot",
            description: `Time slot ${updates.time_slot} is not valid for Year ${yearNum}. Valid slots: ${validSlots.join(', ')}`,
            variant: "destructive",
          });
          return;
        }
      }

      const { error } = await supabase
        .from('timetables')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating timetable entry:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to update timetable entry",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Timetable entry updated successfully",
      });
      
      fetchTimetable();
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

  return {
    timetable,
    subjects,
    validTimeSlots,
    loading,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry
  };
};
