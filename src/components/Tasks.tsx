import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { mockMicroTasks, MicroTask, TaskInteraction } from '../lib/microTaskData';
import { TaskCard } from './TaskCard';
import { TaskGuidanceModal } from './TaskGuidanceModal';
import { TaskFeedback } from './TaskFeedback';
import { AIChatAssistant } from './AIChatAssistant';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';

export const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [taskInteractions, setTaskInteractions] = useState<Record<string, TaskInteraction>>({});
  const [selectedTask, setSelectedTask] = useState<MicroTask | null>(null);
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTask, setFeedbackTask] = useState<MicroTask | null>(null);
  const [activeTab, setActiveTab] = useState('recommended');

  const handleStartTask = (task: MicroTask) => {
    setSelectedTask(task);
    setShowGuidanceModal(true);
  };

  const handleLearnMore = (task: MicroTask) => {
    setSelectedTask(task);
    setShowGuidanceModal(true);
  };

  const handleCompleteTask = (task: MicroTask) => {
    setTaskInteractions({
      ...taskInteractions,
      [task.id]: {
        taskId: task.id,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Show feedback modal
    setFeedbackTask(task);
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = (taskId: string, helpful: boolean, comment?: string) => {
    setTaskInteractions({
      ...taskInteractions,
      [taskId]: {
        ...taskInteractions[taskId],
        taskId,
        helpful,
        comment,
      },
    });
  };

  // Calculate stats
  const completedTasks = Object.values(taskInteractions).filter((t) => t.completed).length;
  const totalTasks = mockMicroTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get recommended tasks (not completed)
  const recommendedTasks = mockMicroTasks.filter(
    (task) => !taskInteractions[task.id]?.completed
  ).slice(0, 5);

  // Get completed tasks
  const completedTasksList = mockMicroTasks.filter(
    (task) => taskInteractions[task.id]?.completed
  );

  // Get tasks by difficulty
  const easyTasks = mockMicroTasks.filter(
    (task) => task.difficulty === 'Easy' && !taskInteractions[task.id]?.completed
  );
  const mediumTasks = mockMicroTasks.filter(
    (task) => task.difficulty === 'Medium' && !taskInteractions[task.id]?.completed
  );
  const hardTasks = mockMicroTasks.filter(
    (task) => task.difficulty === 'Hard' && !taskInteractions[task.id]?.completed
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2">Your Next Steps</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized micro-tasks to accelerate your learning
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Tasks Completed</p>
                <p className="text-2xl">
                  {completedTasks}/{totalTasks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl">{completionRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Recommended</p>
                <p className="text-2xl">{recommendedTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Overall Progress</CardTitle>
            <Badge>{completionRate.toFixed(0)}%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionRate} className="h-3" />
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 dark:text-gray-400">
              {completedTasks} tasks completed
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {totalTasks - completedTasks} remaining
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Task Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="recommended">
            Recommended ({recommendedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="difficulty">By Difficulty</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTasks})
          </TabsTrigger>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
        </TabsList>

        {/* Recommended Tab */}
        <TabsContent value="recommended" className="space-y-6">
          {recommendedTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="mb-2">All Caught Up! 🎉</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You've completed all recommended tasks. Check back later for more!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStart={handleStartTask}
                  onLearnMore={handleLearnMore}
                  isCompleted={taskInteractions[task.id]?.completed}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* By Difficulty Tab */}
        <TabsContent value="difficulty" className="space-y-6">
          {easyTasks.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Easy
                </Badge>
                {easyTasks.length} tasks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {easyTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStart={handleStartTask}
                    onLearnMore={handleLearnMore}
                  />
                ))}
              </div>
            </div>
          )}

          {mediumTasks.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  Medium
                </Badge>
                {mediumTasks.length} tasks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediumTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStart={handleStartTask}
                    onLearnMore={handleLearnMore}
                  />
                ))}
              </div>
            </div>
          )}

          {hardTasks.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-2">
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                  Hard
                </Badge>
                {hardTasks.length} tasks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hardTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStart={handleStartTask}
                    onLearnMore={handleLearnMore}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="space-y-6">
          {completedTasksList.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="mb-2">No Completed Tasks Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start working on recommended tasks to see your progress here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedTasksList.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStart={handleStartTask}
                  onLearnMore={handleLearnMore}
                  isCompleted={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* All Tasks Tab */}
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMicroTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={handleStartTask}
                onLearnMore={handleLearnMore}
                isCompleted={taskInteractions[task.id]?.completed}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <TaskGuidanceModal
        task={selectedTask}
        isOpen={showGuidanceModal}
        onClose={() => {
          setShowGuidanceModal(false);
          setSelectedTask(null);
        }}
        onComplete={handleCompleteTask}
      />

      <TaskFeedback
        task={feedbackTask}
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setFeedbackTask(null);
        }}
        onSubmitFeedback={handleSubmitFeedback}
      />

      {/* AI Chat Assistant */}
      <AIChatAssistant currentTask={selectedTask?.title} />
    </div>
  );
};
