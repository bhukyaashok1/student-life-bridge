
-- Update timetables table to use the fixed time slots based on year
-- First, let's see what time slots we currently have and update them accordingly

-- For first years (semester 1 and 2), the time slots should be:
-- 9:00-10:00, 10:00-11:00, 11:00-12:00, 12:00-12:40 (lunch break), 12:40-01:40, 01:40-02:40, 02:40-03:40

-- For remaining years, the time slots should be:
-- 10:00-11:00, 11:00-12:00, 12:00-01:00, 01:00-01:40 (lunch break), 01:40-02:40, 02:40-03:40, 03:40-04:40

-- Let's add a function to get the correct time slots based on year
CREATE OR REPLACE FUNCTION get_time_slots_for_year(p_year integer)
RETURNS text[]
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_year = 1 THEN
    RETURN ARRAY['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-12:40', '12:40-01:40', '01:40-02:40', '02:40-03:40'];
  ELSE
    RETURN ARRAY['10:00-11:00', '11:00-12:00', '12:00-01:00', '01:00-01:40', '01:40-02:40', '02:40-03:40', '03:40-04:40'];
  END IF;
END;
$$;

-- Create a function to validate time slots when inserting/updating timetables
CREATE OR REPLACE FUNCTION validate_time_slot()
RETURNS TRIGGER AS $$
DECLARE
  valid_slots text[];
BEGIN
  -- Get valid time slots for the year
  valid_slots := get_time_slots_for_year(NEW.year);
  
  -- Check if the time slot is valid for this year
  IF NOT (NEW.time_slot = ANY(valid_slots)) THEN
    RAISE EXCEPTION 'Invalid time slot % for year %. Valid slots are: %', 
      NEW.time_slot, NEW.year, array_to_string(valid_slots, ', ');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate time slots
DROP TRIGGER IF EXISTS validate_timetable_time_slot ON timetables;
CREATE TRIGGER validate_timetable_time_slot
  BEFORE INSERT OR UPDATE ON timetables
  FOR EACH ROW
  EXECUTE FUNCTION validate_time_slot();

-- Create a function to get timetable with proper time slot validation
CREATE OR REPLACE FUNCTION get_timetable_for_class(
  p_branch text, 
  p_year integer, 
  p_semester integer, 
  p_section text
)
RETURNS TABLE(
  id uuid,
  day_of_week text,
  time_slot text,
  subject text,
  branch text,
  year integer,
  semester integer,
  section text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT t.id, t.day_of_week, t.time_slot, t.subject, t.branch, t.year, t.semester, t.section
  FROM timetables t
  WHERE t.branch = p_branch 
    AND t.year = p_year 
    AND t.semester = p_semester 
    AND t.section = p_section
  ORDER BY 
    CASE t.day_of_week
      WHEN 'Monday' THEN 1
      WHEN 'Tuesday' THEN 2
      WHEN 'Wednesday' THEN 3
      WHEN 'Thursday' THEN 4
      WHEN 'Friday' THEN 5
      WHEN 'Saturday' THEN 6
      ELSE 7
    END,
    t.time_slot;
END;
$$;
