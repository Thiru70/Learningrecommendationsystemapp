import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  LayoutDashboard,
  Bookmark,
  User,
  Compass,
  Route,
  ListChecks,
  Target,
} from 'lucide-react';

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      title: 'Tasks',
      icon: ListChecks,
      path: '/tasks',
    },
    {
      title: 'Learning Path',
      icon: Route,
      path: '/learning-path',
    },
    {
      title: 'Recommendations',
      icon: Compass,
      path: '/recommendations',
    },
    {
      title: 'Bookmarks',
      icon: Bookmark,
      path: '/bookmarks',
    },
    {
      title: 'Profile',
      icon: User,
      path: '/profile',
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold">LearnAI</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Smart Learning</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
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
        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
          <p>© 2025 LearnAI</p>
          <p>Powered by ML</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
