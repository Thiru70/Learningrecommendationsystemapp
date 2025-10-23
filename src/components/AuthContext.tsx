import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserInteraction } from '../lib/mockData';
import { LearningGoal } from '../lib/apiService';

interface User {
  id: string;
  email: string;
  name: string;
  interests: string[];
  interactions: Record<string, UserInteraction>;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  goals?: LearningGoal[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateInterests: (interests: string[]) => void;
  updateSkillLevel: (level: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  updateGoals: (goals: LearningGoal[]) => void;
  updateInteraction: (resourceId: string, interaction: Partial<UserInteraction>) => void;
  getInteraction: (resourceId: string) => UserInteraction | undefined;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock user creation
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return false; // User already exists
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      interests: [],
      interactions: {},
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateInterests = (interests: string[]) => {
    if (user) {
      setUser({ ...user, interests });
    }
  };

  const updateSkillLevel = (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    if (user) {
      setUser({ ...user, skillLevel: level });
    }
  };

  const updateGoals = (goals: LearningGoal[]) => {
    if (user) {
      setUser({ ...user, goals });
    }
  };

  const updateInteraction = (resourceId: string, interaction: Partial<UserInteraction>) => {
    if (user) {
      const currentInteraction = user.interactions[resourceId] || { resourceId };
      const updatedInteraction = { ...currentInteraction, ...interaction };
      
      setUser({
        ...user,
        interactions: {
          ...user.interactions,
          [resourceId]: updatedInteraction,
        },
      });
    }
  };

  const getInteraction = (resourceId: string): UserInteraction | undefined => {
    return user?.interactions[resourceId];
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateInterests,
        updateSkillLevel,
        updateGoals,
        updateInteraction,
        getInteraction,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};