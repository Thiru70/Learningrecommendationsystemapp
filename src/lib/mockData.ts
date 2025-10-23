export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'course';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  tags: string[];
  likes: number;
  dislikes: number;
  createdAt: Date;
  imageUrl?: string;
}

export interface UserInteraction {
  resourceId: string;
  liked?: boolean;
  rating?: number;
  status?: 'not-started' | 'in-progress' | 'completed';
  bookmarked?: boolean;
  viewedAt?: Date;
  completedAt?: Date;
}

export const availableInterests = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
  'Blockchain',
  'UI/UX Design',
  'Digital Marketing',
  'Photography',
  'Music Production',
  'Creative Writing',
  'History',
  'Philosophy',
  'Psychology',
  'Business',
  'Finance',
  'Health & Fitness',
  'Language Learning',
];

export const mockResources: LearningResource[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    description: 'Learn the fundamentals of ML algorithms, from linear regression to neural networks.',
    type: 'course',
    difficulty: 'Beginner',
    duration: '8 hours',
    tags: ['Machine Learning', 'Artificial Intelligence', 'Data Science'],
    likes: 1245,
    dislikes: 32,
    createdAt: new Date('2024-10-15'),
    imageUrl: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop',
  },
  {
    id: '2',
    title: 'Building Modern Web Apps with React',
    description: 'Master React hooks, state management, and create production-ready applications.',
    type: 'video',
    difficulty: 'Intermediate',
    duration: '3 hours',
    tags: ['Web Development', 'UI/UX Design'],
    likes: 892,
    dislikes: 15,
    createdAt: new Date('2024-10-18'),
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
  },
  {
    id: '3',
    title: 'The History of Ancient Civilizations',
    description: 'Explore the rise and fall of ancient empires and their lasting impact on modern society.',
    type: 'article',
    difficulty: 'Beginner',
    duration: '20 min',
    tags: ['History'],
    likes: 567,
    dislikes: 8,
    createdAt: new Date('2024-10-20'),
    imageUrl: 'https://images.unsplash.com/photo-1566127992631-137a642a90f4?w=400&h=250&fit=crop',
  },
  {
    id: '4',
    title: 'Advanced Cybersecurity Techniques',
    description: 'Deep dive into penetration testing, network security, and threat detection.',
    type: 'course',
    difficulty: 'Advanced',
    duration: '12 hours',
    tags: ['Cybersecurity'],
    likes: 734,
    dislikes: 21,
    createdAt: new Date('2024-10-10'),
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
  },
  {
    id: '5',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn design principles, user research, wireframing, and prototyping.',
    type: 'video',
    difficulty: 'Beginner',
    duration: '2.5 hours',
    tags: ['UI/UX Design'],
    likes: 1123,
    dislikes: 19,
    createdAt: new Date('2024-10-22'),
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
  },
  {
    id: '6',
    title: 'Blockchain and Cryptocurrency Explained',
    description: 'Understand blockchain technology, smart contracts, and the future of finance.',
    type: 'article',
    difficulty: 'Intermediate',
    duration: '30 min',
    tags: ['Blockchain', 'Finance'],
    likes: 456,
    dislikes: 45,
    createdAt: new Date('2024-10-12'),
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
  },
  {
    id: '7',
    title: 'Cloud Computing with AWS',
    description: 'Master AWS services including EC2, S3, Lambda, and build scalable applications.',
    type: 'course',
    difficulty: 'Intermediate',
    duration: '10 hours',
    tags: ['Cloud Computing', 'Web Development'],
    likes: 989,
    dislikes: 28,
    createdAt: new Date('2024-10-08'),
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop',
  },
  {
    id: '8',
    title: 'Music Production for Beginners',
    description: 'Learn beat making, mixing, mastering, and create your first track.',
    type: 'video',
    difficulty: 'Beginner',
    duration: '4 hours',
    tags: ['Music Production'],
    likes: 678,
    dislikes: 12,
    createdAt: new Date('2024-10-19'),
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=250&fit=crop',
  },
  {
    id: '9',
    title: 'Data Science with Python',
    description: 'Pandas, NumPy, Matplotlib - everything you need for data analysis.',
    type: 'course',
    difficulty: 'Intermediate',
    duration: '15 hours',
    tags: ['Data Science', 'Machine Learning'],
    likes: 1567,
    dislikes: 43,
    createdAt: new Date('2024-10-05'),
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
  },
  {
    id: '10',
    title: 'Psychology of Human Behavior',
    description: 'Understand cognitive biases, decision making, and behavioral patterns.',
    type: 'article',
    difficulty: 'Beginner',
    duration: '25 min',
    tags: ['Psychology'],
    likes: 834,
    dislikes: 17,
    createdAt: new Date('2024-10-21'),
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=250&fit=crop',
  },
  {
    id: '11',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile apps for iOS and Android.',
    type: 'course',
    difficulty: 'Intermediate',
    duration: '9 hours',
    tags: ['Mobile Development', 'Web Development'],
    likes: 721,
    dislikes: 22,
    createdAt: new Date('2024-10-14'),
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
  },
  {
    id: '12',
    title: 'Digital Marketing Strategies',
    description: 'SEO, social media marketing, email campaigns, and analytics.',
    type: 'video',
    difficulty: 'Beginner',
    duration: '3.5 hours',
    tags: ['Digital Marketing', 'Business'],
    likes: 445,
    dislikes: 11,
    createdAt: new Date('2024-10-16'),
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
  },
];
