
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  branch: string;
  section: string;
  year: number;
  semester: number;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  sgpa: number;
  cgpa: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  date: string;
  isPresent: boolean;
  totalWorkingDays: number;
  attendedDays: number;
  percentage: number;
}

export interface MarksRecord {
  id: string;
  studentId: string;
  subject: string;
  semester: number;
  mid1: number;
  mid2: number;
  assignment: number;
  endExam: number;
  total: number;
}

export interface TimeSlot {
  timeSlot: string;
  subject: string;
}

export interface Timetable {
  year: number;
  semester: number;
  branch: string;
  section: string;
  schedule: {
    [day: string]: TimeSlot[];
  };
}

export interface QuestionPaper {
  id: string;
  title: string;
  filename: string;
  subject: string;
  year: number;
  semester: number;
  uploadedAt: string;
  url: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'exam' | 'assignment' | 'event' | 'attendance';
  targetYear?: number;
  targetSemester?: number;
  targetBranch?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  studentId: string;
  type: 'academic' | 'non-academic' | 'app-feedback';
  title: string;
  message: string;
  status: 'pending' | 'in-review' | 'resolved';
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Downloadable {
  id: string;
  type: string;
  fileName: string;
  url: string;
  year?: number;
  semester?: number;
  uploadedAt: string;
}
