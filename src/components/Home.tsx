import React from 'react';
import { useAuth } from '../context/UserContext';
import { mockResources } from '../lib/mockData';
import { ResourceCard } from './ResourceCard';
import { ProgressPrediction } from './ProgressPrediction';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  TrendingUp,
  BookOpen,
  Clock,
  Target,
  ArrowRight,
  Award,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  if (!user) return null;

  // Calculate stats
  const interactions = Object.values(user.interactions);
  const completedCount = interactions.filter((i) => i.status === 'completed').length;
  const inProgressCount = interactions.filter((i) => i.status === 'in-progress').length;
  const bookmarkedCount = interactions.filter((i) => i.bookmarked).length;

  // Calculate total learning hours
  const totalHours = interactions.reduce((acc, interaction) => {
    const resource = mockResources.find((r) => r.id === interaction.resourceId);
    if (resource && interaction.status === 'completed') {
      const hours = parseFloat(resource.duration.split(' ')[0]);
      return acc + (isNaN(hours) ? 0.5 : hours);
    }
    return acc;
  }, 0);

  // Get learning goal progress
  const goal = user.goals?.[0];
  const goalProgress = goal?.progress || 0;

  // Get in-progress resources
  const inProgressResources = mockResources
    .filter((r) => user.interactions[r.id]?.status === 'in-progress')
    .slice(0, 3);

  // Get recommended resources based on interests
  const recommendedResources = mockResources
    .filter((r) => r.tags.some((tag) => user.interests.includes(tag)))
    .sort((a, b) => {
      const aScore = a.tags.filter((tag) => user.interests.includes(tag)).length;
      const bScore = b.tags.filter((tag) => user.interests.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, 3);

  // Chart data
  const activityData = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 1.5 },
    { name: 'Wed', hours: 3 },
    { name: 'Thu', hours: 2.5 },
    { name: 'Fri', hours: 1 },
    { name: 'Sat', hours: 4 },
    { name: 'Sun', hours: 2 },
  ];

  const skillDistribution = [
    { name: 'Completed', value: completedCount, color: '#10b981' },
    { name: 'In Progress', value: inProgressCount, color: '#6366f1' },
    { name: 'Bookmarked', value: bookmarkedCount, color: '#f59e0b' },
  ];

  const topicProgress = user.interests.slice(0, 5).map((interest) => {
    const relatedResources = mockResources.filter((r) =>
      r.tags.includes(interest)
    );
    const completedInTopic = relatedResources.filter(
      (r) => user.interactions[r.id]?.status === 'completed'
    ).length;
    return {
      topic: interest.length > 15 ? interest.substring(0, 15) + '...' : interest,
      completed: completedInTopic,
      total: relatedResources.length,
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your learning overview and progress
        </p>
      </div>

      {/* Progress Prediction */}
      <ProgressPrediction />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Award className="w-6 h-6 text-green-600 dark:text-green-300" />
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
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Bookmarked</p>
                <p className="text-2xl">{bookmarkedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Goal */}
      {goal && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <CardTitle>Current Learning Goal</CardTitle>
              </div>
              <Badge>{goalProgress}% Complete</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{goal.goal}</p>
            <Progress value={goalProgress} className="h-3" />
            <div className="flex justify-between mt-2">
              <span className="text-gray-600 dark:text-gray-400">
                Target: {new Date(goal.targetDate).toLocaleDateString()}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Learning Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={skillDistribution.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Topic Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Topic Progress</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topicProgress} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="topic" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="total" fill="#e5e7eb" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Continue Learning */}
      {inProgressResources.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Continue Learning</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('recommendations')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended for You */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>Recommended for You</h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('recommendations')}>
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  );
};