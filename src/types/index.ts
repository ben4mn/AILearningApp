export interface Era {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
}

export interface Lesson {
  slug: string;
  title: string;
  lessonOrder: number;
  content: string;
  wordCount: number;
  readingTimeMinutes: number;
}

export interface Topic {
  slug: string;
  title: string;
  description: string;
  eraId: string;
  linearOrder: number;
  icon: string;
  estimatedMinutes: number;
  lessons: Lesson[];
}

export interface LessonProgress {
  lessonId: string;       // "topicSlug/lessonSlug"
  topicId: string;
  status: 'unread' | 'in-progress' | 'completed';
  scrollPercent: number;
  completedAt: string | null;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;   // YYYY-MM-DD
  readDates: string[];
  totalLessonsCompleted: number;
}
