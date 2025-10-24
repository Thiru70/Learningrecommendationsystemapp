// Enhanced API service for ML backend integration with TypeScript
import {
  Resource,
  MicroTask,
  LearningPathStep,
  Notification,
  ProgressPrediction,
  ProgressStats,
  Feedback,
  ChatMessage,
  OnboardingData,
  User,
  ApiResponse,
  SearchFilters,
} from '../types';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock response wrapper
function mockResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    success: true,
    message: 'Success',
  };
}

export const apiService = {
  // User Profile & Onboarding
  async updateUserProfile(userId: string, data: OnboardingData): Promise<ApiResponse<User>> {
    await delay(500);
    console.log('Updating user profile:', { userId, data });
    
    const user: User = {
      id: userId,
      email: 'user@example.com',
      name: 'User Name',
      interests: data.interests,
      skillLevel: data.skillLevel,
      learningGoal: data.learningGoal,
      goalTimeline: data.goalTimeline,
      createdAt: new Date(),
    };
    
    return mockResponse(user);
  },

  // Dashboard & Progress
  async getProgressStats(userId: string): Promise<ApiResponse<ProgressStats>> {
    await delay(400);
    
    const stats: ProgressStats = {
      totalHoursLearned: 47.5,
      modulesCompleted: 12,
      currentStreak: 5,
      weeklyActivity: [
        { day: 'Mon', hours: 2.5 },
        { day: 'Tue', hours: 3.0 },
        { day: 'Wed', hours: 1.5 },
        { day: 'Thu', hours: 4.0 },
        { day: 'Fri', hours: 2.0 },
        { day: 'Sat', hours: 0 },
        { day: 'Sun', hours: 1.5 },
      ],
      topicProgress: [
        { topic: 'Machine Learning', progress: 65 },
        { topic: 'Python', progress: 80 },
        { topic: 'Statistics', progress: 45 },
        { topic: 'Data Visualization', progress: 55 },
      ],
    };
    
    return mockResponse(stats);
  },

  async getProgressPrediction(userId: string): Promise<ApiResponse<ProgressPrediction>> {
    await delay(400);
    
    const predictions: ProgressPrediction[] = [
      {
        status: 'on-track',
        confidence: 0.85,
        message: "You're on track to complete your learning goals! Keep up the great work.",
        recommendations: ['Continue your daily learning streak', 'Try more challenging exercises'],
      },
      {
        status: 'at-risk',
        confidence: 0.72,
        message: "You might fall behind on your goals. Consider dedicating more time this week.",
        recommendations: ['Set aside 30 minutes daily', 'Focus on completing started courses', 'Review missed topics'],
      },
      {
        status: 'ahead',
        confidence: 0.91,
        message: "Amazing! You're ahead of schedule. Consider exploring advanced topics!",
        recommendations: ['Try advanced projects', 'Mentor other learners', 'Explore new topics'],
      },
    ];
    
    return mockResponse(predictions[Math.floor(Math.random() * predictions.length)]);
  },

  // Learning Path
  async getLearningPath(userId: string): Promise<ApiResponse<LearningPathStep[]>> {
    await delay(500);
    
    const steps: LearningPathStep[] = [
      {
        id: '1',
        title: 'Introduction to Python',
        description: 'Learn Python basics and syntax',
        resourceId: '1',
        duration: '8 hours',
        difficulty: 'Easy',
        completed: true,
        order: 1,
      },
      {
        id: '2',
        title: 'Data Structures in Python',
        description: 'Master lists, dicts, and sets',
        resourceId: '2',
        duration: '6 hours',
        difficulty: 'Medium',
        completed: true,
        order: 2,
        dependencies: ['1'],
      },
      {
        id: '3',
        title: 'Introduction to Machine Learning',
        description: 'Understand ML fundamentals',
        resourceId: '3',
        duration: '12 hours',
        difficulty: 'Medium',
        completed: false,
        order: 3,
        dependencies: ['2'],
      },
      {
        id: '4',
        title: 'Deep Learning Fundamentals',
        description: 'Learn neural networks and deep learning',
        resourceId: '4',
        duration: '15 hours',
        difficulty: 'Hard',
        completed: false,
        order: 4,
        dependencies: ['3'],
      },
      {
        id: '5',
        title: 'Natural Language Processing',
        description: 'Process and analyze text data',
        resourceId: '5',
        duration: '10 hours',
        difficulty: 'Hard',
        completed: false,
        order: 5,
        dependencies: ['4'],
      },
    ];
    
    return mockResponse(steps);
  },

  async updateLearningPath(userId: string, steps: LearningPathStep[]): Promise<ApiResponse<boolean>> {
    await delay(300);
    console.log('Updating learning path:', { userId, steps });
    return mockResponse(true);
  },

  async markStepCompleted(userId: string, stepId: string): Promise<ApiResponse<boolean>> {
    await delay(300);
    console.log('Marking step completed:', { userId, stepId });
    return mockResponse(true);
  },

  // Recommendations & Search
  async getRecommendations(
    userId: string,
    filters?: SearchFilters
  ): Promise<ApiResponse<Resource[]>> {
    await delay(600);
    const { mockResources } = await import('./mockData');
    
    let filtered = [...mockResources];
    
    if (filters?.type && filters.type.length > 0) {
      filtered = filtered.filter(r => filters.type!.includes(r.type));
    }
    
    if (filters?.difficulty && filters.difficulty.length > 0) {
      filtered = filtered.filter(r => filters.difficulty!.includes(r.difficulty));
    }
    
    if (filters?.topics && filters.topics.length > 0) {
      filtered = filtered.filter(r =>
        r.tags.some(tag => filters.topics!.includes(tag))
      );
    }
    
    // Sort
    if (filters?.sortBy === 'liked') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (filters?.sortBy === 'newest') {
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    }
    
    return mockResponse(filtered.slice(0, 12));
  },

  async semanticSearch(query: string, userId: string): Promise<ApiResponse<Resource[]>> {
    await delay(700);
    
    const { mockResources } = await import('./mockData');
    const keywords = query.toLowerCase().split(' ');
    
    const scored = mockResources.map(resource => {
      const resourceText = `${resource.title} ${resource.description} ${resource.tags.join(' ')}`.toLowerCase();
      let score = 0;
      
      keywords.forEach(keyword => {
        if (resourceText.includes(keyword)) {
          score += 1;
        }
      });
      
      return { resource, score };
    });
    
    const results = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.resource)
      .slice(0, 8);
    
    return mockResponse(results);
  },

  // Micro Tasks
  async getMicroTasks(userId: string): Promise<ApiResponse<MicroTask[]>> {
    await delay(500);
    const { mockMicroTasks } = await import('./microTaskData');
    return mockResponse(mockMicroTasks.slice(0, 5));
  },

  async getTaskById(taskId: string): Promise<ApiResponse<MicroTask>> {
    await delay(300);
    const { mockMicroTasks } = await import('./microTaskData');
    const task = mockMicroTasks.find(t => t.id === taskId);
    
    if (!task) {
      return {
        data: null as any,
        success: false,
        error: 'Task not found',
      };
    }
    
    return mockResponse(task);
  },

  // Notifications
  async getNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    await delay(300);
    
    const notifications: Notification[] = [
      {
        id: '1',
        type: 'reminder',
        title: 'Keep Learning!',
        message: "You're on a 5-day streak! Complete today's task to continue.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        actionUrl: '/tasks',
      },
      {
        id: '2',
        type: 'success',
        title: 'Goal Progress',
        message: "You've completed 60% of your learning path. Great job!",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: '3',
        type: 'warning',
        title: 'Attention Needed',
        message: "You haven't practiced in 3 days. Quick refresher?",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '4',
        type: 'info',
        title: 'New Content Available',
        message: 'Check out our new Advanced React Patterns course!',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        read: true,
      },
    ];
    
    return mockResponse(notifications);
  },

  async markNotificationRead(notificationId: string): Promise<ApiResponse<boolean>> {
    await delay(200);
    console.log('Marking notification as read:', notificationId);
    return mockResponse(true);
  },

  // Feedback
  async submitFeedback(feedback: Feedback): Promise<ApiResponse<boolean>> {
    await delay(300);
    console.log('Feedback submitted:', feedback);
    return mockResponse(true);
  },

  async submitTaskFeedback(
    taskId: string,
    helpful: boolean,
    comment?: string
  ): Promise<ApiResponse<boolean>> {
    await delay(300);
    console.log('Task feedback submitted:', { taskId, helpful, comment });
    return mockResponse(true);
  },

  // Bookmarks
  async toggleBookmark(userId: string, resourceId: string): Promise<ApiResponse<boolean>> {
    await delay(200);
    console.log('Toggling bookmark:', { userId, resourceId });
    return mockResponse(true);
  },

  async getBookmarks(userId: string): Promise<ApiResponse<Resource[]>> {
    await delay(400);
    const { mockResources } = await import('./mockData');
    const bookmarked = mockResources.filter(r => r.isBookmarked).slice(0, 6);
    return mockResponse(bookmarked);
  },

  // AI Chat
  async sendChatMessage(
    userId: string,
    message: string,
    context?: { currentTask?: string; learningPath?: string[] }
  ): Promise<ApiResponse<ChatMessage>> {
    await delay(800);
    
    const response = generateChatResponse(message, context);
    
    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    
    return mockResponse(chatMessage);
  },
};

// Helper function for AI chat responses
function generateChatResponse(userMessage: string, context?: any): string {
  const lowercaseMsg = userMessage.toLowerCase();
  
  if (lowercaseMsg.includes('stuck') || lowercaseMsg.includes('help')) {
    return "I understand you're having trouble. Let me help break this down:\n\n1. Try reviewing the previous step\n2. Check the code examples provided\n3. Practice with a simpler version first\n\nWould you like me to suggest an easier alternative task?";
  }
  
  if (lowercaseMsg.includes('easier') || lowercaseMsg.includes('too hard')) {
    return "Here are some easier alternatives:\n\n• Basic String Manipulation\n• Simple Calculator Function\n• List Operations Practice\n\nThese will help build your foundation before tackling the harder concepts!";
  }
  
  if (lowercaseMsg.includes('explain') || lowercaseMsg.includes('what is')) {
    return "Let me break this concept down:\n\nThink of it like organizing books on a shelf. Each book has a position (index), and you can add or remove books (elements) in different ways. The key is understanding how the structure maintains order and allows quick access.\n\nWould you like a code example?";
  }
  
  if (lowercaseMsg.includes('example')) {
    return "Here's a practical example:\n\n```python\n# Create a list\nmy_list = ['apple', 'banana', 'orange']\n\n# Add item\nmy_list.append('grape')\n\n# Access item\nfirst_item = my_list[0]  # 'apple'\n\n# Remove item\nmy_list.remove('banana')\n```\n\nTry this in your editor and see how it works!";
  }
  
  return "I'm here to help! You can ask me to:\n\n• Explain concepts in simpler terms\n• Provide code examples\n• Suggest easier alternatives\n• Review your learning path\n• Recommend next steps\n\nWhat would you like to know?";
}