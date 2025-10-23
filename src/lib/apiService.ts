// Mock API service for ML backend integration
import { LearningResource } from './mockData';

export interface LearningGoal {
  id: string;
  goal: string;
  targetDate: string;
  progress: number;
}

export interface LearningPathStep {
  id: string;
  resourceId: string;
  order: number;
  completed: boolean;
  estimatedDuration: string;
  prerequisite?: string;
}

export interface Notification {
  id: string;
  type: 'progress' | 'recommendation' | 'reminder' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface ProgressPrediction {
  status: 'on-track' | 'at-risk' | 'behind';
  message: string;
  confidence: number;
  factors: string[];
}

export interface SearchResult {
  resource: LearningResource;
  relevanceScore: number;
  matchedQuery: string;
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Learning Path
  async getLearningPath(userId: string): Promise<LearningPathStep[]> {
    await delay(500);
    // Mock learning path based on user interests
    return [
      { id: '1', resourceId: '1', order: 1, completed: false, estimatedDuration: '8 hours' },
      { id: '2', resourceId: '2', order: 2, completed: false, estimatedDuration: '3 hours', prerequisite: '1' },
      { id: '3', resourceId: '9', order: 3, completed: false, estimatedDuration: '15 hours', prerequisite: '2' },
      { id: '4', resourceId: '4', order: 4, completed: false, estimatedDuration: '12 hours', prerequisite: '3' },
    ];
  },

  async updateLearningPath(userId: string, steps: LearningPathStep[]): Promise<boolean> {
    await delay(300);
    return true;
  },

  // Smart Search with semantic matching
  async semanticSearch(query: string, userId: string): Promise<SearchResult[]> {
    await delay(700);
    // Mock semantic search - in real implementation, this would use Sentence-BERT
    const mockResults: SearchResult[] = [];
    
    // Simple keyword matching for mock
    const keywords = query.toLowerCase().split(' ');
    const { mockResources } = await import('./mockData');
    
    mockResources.forEach(resource => {
      const resourceText = `${resource.title} ${resource.description} ${resource.tags.join(' ')}`.toLowerCase();
      let score = 0;
      
      keywords.forEach(keyword => {
        if (resourceText.includes(keyword)) {
          score += 1;
        }
      });
      
      if (score > 0) {
        mockResults.push({
          resource,
          relevanceScore: score / keywords.length,
          matchedQuery: query,
        });
      }
    });
    
    return mockResults.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 6);
  },

  async getSearchSuggestions(query: string): Promise<string[]> {
    await delay(200);
    const suggestions = [
      'How do I learn Python?',
      'Resources to master statistics for ML',
      'Best courses for web development',
      'Machine learning for beginners',
      'Advanced React patterns',
      'Data science roadmap',
    ];
    
    return suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  },

  // Progress Prediction
  async getProgressPrediction(userId: string): Promise<ProgressPrediction> {
    await delay(400);
    
    // Mock ML-based prediction
    const predictions: ProgressPrediction[] = [
      {
        status: 'on-track',
        message: "You're on track to complete your learning goals! Keep up the great work.",
        confidence: 0.85,
        factors: ['Consistent daily activity', 'High completion rate', 'Regular engagement'],
      },
      {
        status: 'at-risk',
        message: "You might fall behind on your goals. Consider dedicating more time this week.",
        confidence: 0.72,
        factors: ['Decreased activity', 'Several incomplete resources', 'No activity in 5 days'],
      },
      {
        status: 'behind',
        message: "You're behind schedule. Let's get back on track with smaller, achievable goals!",
        confidence: 0.91,
        factors: ['Low completion rate', 'Infrequent logins', 'Goals deadline approaching'],
      },
    ];
    
    // Random for demo - in reality, this would be ML model output
    return predictions[Math.floor(Math.random() * predictions.length)];
  },

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(300);
    
    return [
      {
        id: '1',
        type: 'progress',
        title: 'Halfway There!',
        message: "You're halfway through your learning goal — keep going!",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'New Recommendation',
        message: 'People who completed "Introduction to Machine Learning" also liked "Data Science with Python"',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: '3',
        type: 'reminder',
        title: 'Keep Learning!',
        message: "You haven't completed a resource in 7 days — jump back in!",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '4',
        type: 'achievement',
        title: '🎉 Achievement Unlocked!',
        message: 'You completed 5 courses in Machine Learning!',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        read: true,
      },
    ];
  },

  async markNotificationRead(notificationId: string): Promise<boolean> {
    await delay(200);
    return true;
  },

  async dismissNotification(notificationId: string): Promise<boolean> {
    await delay(200);
    return true;
  },

  // Feedback
  async submitFeedback(resourceId: string, feedback: {
    rating?: number;
    liked?: boolean;
    review?: string;
    completed?: boolean;
  }): Promise<boolean> {
    await delay(300);
    console.log('Feedback submitted:', { resourceId, feedback });
    return true;
  },

  // User Goals
  async saveUserGoals(userId: string, goals: LearningGoal[]): Promise<boolean> {
    await delay(300);
    return true;
  },

  async getUserGoals(userId: string): Promise<LearningGoal[]> {
    await delay(300);
    return [
      {
        id: '1',
        goal: 'Learn data science in 3 months',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 35,
      },
    ];
  },
};
