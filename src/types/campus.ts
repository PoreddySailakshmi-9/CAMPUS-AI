export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type ClassType = 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar';

export interface TimetableClass {
  id: string;
  courseCode: string;
  courseName: string;
  type: ClassType;
  day: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  room: string;
  instructorTitle: string; // e.g., "Dr. R. Vance (Dept. Chair)"
  credits: number;
  attendedSessions: number;
  totalSessions: number;
  color: string; // accent color class
}

export type AssignmentStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Graded';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // "23:59"
  priority: Priority;
  status: AssignmentStatus;
  weightage: number; // e.g. 15%
  grade?: string; // e.g. "94/100"
  description: string;
  isBookmarked: boolean;
  tasks?: { id: string; text: string; completed: boolean }[];
}

export interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  examType: 'Midterm' | 'Final' | 'Lab Practical' | 'Quiz';
  date: string; // YYYY-MM-DD
  time: string; // "10:00 AM - 01:00 PM"
  hall: string;
  seatBlock: string;
  weightage: number;
  readinessPercentage: number;
  syllabusTopics: string[];
}

export interface Notice {
  id: string;
  title: string;
  category: 'Urgent' | 'Academic' | 'Examination' | 'Placement' | 'Library' | 'Administration';
  department: string;
  date: string;
  summary: string;
  content: string;
  isUrgent: boolean;
  isRead: boolean;
  isBookmarked: boolean;
  attachmentName?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Hackathon' | 'Workshop' | 'Seminar' | 'Career' | 'Cultural' | 'Sports';
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  capacity: number;
  registeredCount: number;
  isRegistered: boolean;
  isBookmarked: boolean;
}

export interface LearningResource {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  category: 'Lecture Notes' | 'Lab Manual' | 'Past Paper' | 'Reference Code' | 'Textbook';
  fileFormat: 'PDF' | 'ZIP' | 'DOCX' | 'GITHUB' | 'LINK';
  fileSize?: string;
  downloadUrl?: string;
  uploadDate: string;
  isBookmarked: boolean;
}

export interface StudySession {
  id: string;
  date: string;
  courseCode: string;
  durationMinutes: number;
  topicsCovered: string;
  focusRating: 1 | 2 | 3 | 4 | 5;
}

export interface StudentProfile {
  studentId: string;
  degree: string;
  major: string;
  department: string;
  academicYear: string;
  currentSemester: number;
  cgpa: number;
  targetGpa: number;
  earnedCredits: number;
  totalDegreeCredits: number;
  campusBranch: string;
  academicAdvisor: string;
  libraryCardNo: string;
  officialEmail: string;
}
