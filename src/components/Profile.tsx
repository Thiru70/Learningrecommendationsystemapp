import React from 'react';
import { useAuth } from '../context/UserContext';
import { mockResources } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  User,
  Clock,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Button } from './ui/button';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Calculate stats
  const interactions = Object.values(user.interactions);
  const completedCount = interactions.filter((i) => i.status === 'completed').length;
  const inProgressCount = interactions.filter((i) => i.status === 'in-progress').length;
  const viewedResources = interactions.filter((i) => i.viewedAt).length;

  // Calculate total learning hours (mock calculation)
  const totalHours = interactions.reduce((acc, interaction) => {
    const resource = mockResources.find((r) => r.id === interaction.resourceId);
    if (resource && interaction.status === 'completed') {
      const hours = parseFloat(resource.duration.split(' ')[0]);
      return acc + (isNaN(hours) ? 0.5 : hours);
    }
    return acc;
  }, 0);

  // Get learning history
  const history = interactions
    .filter((i) => i.viewedAt)
    .sort((a, b) => {
      const dateA = a.viewedAt ? new Date(a.viewedAt).getTime() : 0;
      const dateB = b.viewedAt ? new Date(b.viewedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 10)
    .map((interaction) => ({
      ...interaction,
      resource: mockResources.find((r) => r.id === interaction.resourceId),
    }));

  // Topic progress
  const topicProgress = user.interests.map((interest) => {
    const relatedResources = mockResources.filter((r) =>
      r.tags.includes(interest)
    );
    const completedInTopic = relatedResources.filter(
      (r) => user.interactions[r.id]?.status === 'completed'
    ).length;
    const percentage =
      relatedResources.length > 0
        ? (completedInTopic / relatedResources.length) * 100
        : 0;
    return {
      topic: interest,
      completed: completedInTopic,
      total: relatedResources.length,
      percentage,
    };
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user.interests.slice(0, 5).map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
                {user.interests.length > 5 && (
                  <Badge variant="outline">+{user.interests.length - 5} more</Badge>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Hours</p>
                <p className="text-2xl">{totalHours.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Topics</p>
                <p className="text-2xl">{user.interests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Topic Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topicProgress.slice(0, 5).map((topic) => (
              <div key={topic.topic}>
                <div className="flex items-center justify-between mb-2">
                  <span>{topic.topic}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {topic.completed}/{topic.total}
                  </span>
                </div>
                <Progress value={topic.percentage} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Learning History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.resourceId}
                    className="flex items-start gap-3 pb-3 border-b last:border-0 dark:border-gray-700"
                  >
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1">{item.resource?.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.status === 'completed'
                              ? 'default'
                              : item.status === 'in-progress'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {item.status?.replace('-', ' ')}
                        </Badge>
                        {item.rating && (
                          <span className="text-gray-600 dark:text-gray-400">
                            ★ {item.rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                No learning activity yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};