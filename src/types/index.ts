// Global TypeScript type definitions

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  interests: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  learningGoal?: string;
  goalTimeline?: string;
  createdAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'course' | 'tutorial' | 'practice';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  url?: string;
  rating?: number;
  likes: number;
  isBookmarked?: boolean;
  isLiked?: boolean;
  completedAt?: Date;
}

export interface MicroTask {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  recommendationReason: string;
  category: string;
  estimatedTime: string;
  steps: TaskStep[];
  videoUrl?: string;
  completed?: boolean;
}

export interface TaskStep {
  step: number;
  title: string;
  content: string;
  codeExample?: string;
}

export interface LearningPathStep {
  id: string;
  title: string;
  description: string;
  resourceId: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  order: number;
  dependencies?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface ProgressStats {
  totalHoursLearned: number;
  modulesCompleted: number;
  currentStreak: number;
  weeklyActivity: { day: string; hours: number }[];
  topicProgress: { topic: string; progress: number }[];
}

export interface ProgressPrediction {
  status: 'on-track' | 'at-risk' | 'ahead';
  confidence: number;
  message: string;
  recommendations?: string[];
}

export interface Feedback {
  resourceId: string;
  helpful: boolean;
  rating?: number;
  comment?: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface OnboardingData {
  interests: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  learningGoal: string;
  goalTimeline: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
}

export interface SearchFilters {
  type?: string[];
  difficulty?: string[];
  topics?: string[];
  sortBy?: 'relevant' | 'liked' | 'newest' | 'duration';
}
