import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import {
  Home,
  Bookmark,
  User,
  LogOut,
  BookOpen,
  Moon,
  Sun,
  Compass,
  Route,
  Bell,
  ListChecks,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout, isDarkMode, toggleDarkMode } = useAuth();

  const menuItems = [
    {
      title: 'Home',
      icon: Home,
      page: 'home',
    },
    {
      title: 'Tasks',
      icon: ListChecks,
      page: 'tasks',
    },
    {
      title: 'Recommendations',
      icon: Compass,
      page: 'recommendations',
    },
    {
      title: 'Learning Path',
      icon: Route,
      page: 'learning-path',
    },
    {
      title: 'Bookmarks',
      icon: Bookmark,
      page: 'bookmarks',
    },
    {
      title: 'Profile',
      icon: User,
      page: 'profile',
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold">LearnHub</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Learning Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.page)}
                    isActive={currentPage === item.page}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Dark Mode
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
        {user && (
          <div className="px-4 py-2 border-t dark:border-gray-700">
            <p className="truncate">{user.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};