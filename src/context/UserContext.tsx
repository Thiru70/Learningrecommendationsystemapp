import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, OnboardingData } from '../types';
import { UserInteraction } from '../lib/mockData';
import { LearningGoal } from '../lib/apiService';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  updateInterests: (interests: string[]) => void;
  updateSkillLevel: (level: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  updateGoals: (goals: LearningGoal[]) => void;
  updateInteraction: (resourceId: string, interaction: Partial<UserInteraction>) => void;
  getInteraction: (resourceId: string) => UserInteraction | undefined;
}

// Extended User type with interactions
interface ExtendedUser extends User {
  interactions?: Record<string, UserInteraction>;
  goals?: LearningGoal[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

// Also export as useAuth for backward compatibility
export const useAuth = useUser;

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Check for existing session - check both old and new storage keys
    const storedUser = localStorage.getItem('user') || localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsOnboarded(parsedUser.interests?.length > 0);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - check both old and new users storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      const mockUser: ExtendedUser = {
        ...userWithoutPassword,
        interactions: userWithoutPassword.interactions || {},
        createdAt: new Date(userWithoutPassword.createdAt || Date.now()),
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsOnboarded(mockUser.interests?.length > 0);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return;
    }
    
    // Fallback mock for new users
    const mockUser: ExtendedUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      interests: [],
      skillLevel: 'Beginner',
      interactions: {},
      createdAt: new Date(),
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      interests: [],
      interactions: {},
      skillLevel: 'Beginner' as const,
      createdAt: new Date(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    const mockUser: ExtendedUser = {
      ...userWithoutPassword,
      createdAt: new Date(userWithoutPassword.createdAt),
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsOnboarded(false);
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const completeOnboarding = async (data: OnboardingData) => {
    if (user) {
      const updatedUser: ExtendedUser = {
        ...user,
        interests: data.interests,
        skillLevel: data.skillLevel,
        learningGoal: data.learningGoal,
        goalTimeline: data.goalTimeline,
      };

      setUser(updatedUser);
      setIsOnboarded(true);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Send to backend
      // await apiService.updateUserProfile(updatedUser);
    }
  };

  const updateInterests = (interests: string[]) => {
    if (user) {
      const updatedUser = { ...user, interests };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const updateSkillLevel = (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    if (user) {
      const updatedUser = { ...user, skillLevel: level };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const updateGoals = (goals: LearningGoal[]) => {
    if (user) {
      const updatedUser = { ...user, goals };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const updateInteraction = (resourceId: string, interaction: Partial<UserInteraction>) => {
    if (user) {
      const updatedInteractions = {
        ...user.interactions,
        [resourceId]: {
          ...user.interactions?.[resourceId],
          ...interaction,
        } as UserInteraction,
      };
      
      const updatedUser = { ...user, interactions: updatedInteractions };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const getInteraction = (resourceId: string): UserInteraction | undefined => {
    return user?.interactions?.[resourceId];
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isOnboarded,
        login,
        signup,
        logout,
        updateUser,
        completeOnboarding,
        updateInterests,
        updateSkillLevel,
        updateGoals,
        updateInteraction,
        getInteraction,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};