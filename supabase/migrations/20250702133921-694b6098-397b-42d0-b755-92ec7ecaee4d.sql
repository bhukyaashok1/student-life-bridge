
-- Add time_slot column to attendance table
ALTER TABLE public.attendance 
ADD COLUMN time_slot text;

-- Update the marks table total calculation since it's currently wrong
-- The total should be calculated as sum of mid1 + mid2 + assignment, not divided by 3
ALTER TABLE public.marks 
DROP COLUMN total;

ALTER TABLE public.marks 
ADD COLUMN total numeric GENERATED ALWAYS AS (mid1 + mid2 + assignment) STORED;
