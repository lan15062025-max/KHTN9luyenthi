import { LucideIcon } from 'lucide-react';

export type Subject = 'Vật lí' | 'Hóa học' | 'Sinh học';

export interface Question {
  id: string;
  subject: Subject;
  topic: string;
  level: 'NB' | 'TH' | 'VD';
  content: string;
  options: string[];
  correctAnswer: number; // Index of options
  explanation: string;
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  subjectStats: {
    [key in Subject]: {
      correct: number;
      total: number;
    };
  };
}

export interface TopicGroup {
  subject: Subject;
  topics: string[];
  icon: LucideIcon;
}
