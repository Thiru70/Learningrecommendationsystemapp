import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/UserContext';
import { apiService, LearningPathStep } from '../lib/apiService';
import { mockResources } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Check,
  Circle,
  Lock,
  Clock,
  PlayCircle,
  FileText,
  GraduationCap,
  Loader2,
  Route,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const LearningPath: React.FC = () => {
  const { user, updateInteraction, getInteraction } = useAuth();
  const [pathSteps, setPathSteps] = useState<LearningPathStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLearningPath();
    }
  }, [user]);

  const loadLearningPath = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const steps = await apiService.getLearningPath(user.id);
      setPathSteps(steps);
    } catch (error) {
      console.error('Failed to load learning path:', error);
      toast.error('Failed to load learning path');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = (step: LearningPathStep) => {
    const resource = mockResources.find(r => r.id === step.resourceId);
    if (!resource) return;

    updateInteraction(resource.id, {
      status: 'completed',
      completedAt: new Date(),
    });

    // Update local step state
    setPathSteps(pathSteps.map(s => 
      s.id === step.id ? { ...s, completed: true } : s
    ));

    toast.success(`Completed: ${resource.title}`);
  };

  const handleStartLearning = (step: LearningPathStep) => {
    const resource = mockResources.find(r => r.id === step.resourceId);
    if (!resource) return;

    updateInteraction(resource.id, {
      status: 'in-progress',
      viewedAt: new Date(),
    });

    toast.success(`Started: ${resource.title}`);
  };

  const isStepUnlocked = (step: LearningPathStep) => {
    if (!step.prerequisite) return true;
    const prereqStep = pathSteps.find(s => s.id === step.prerequisite);
    return prereqStep?.completed || false;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'course':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const completedSteps = pathSteps.filter(s => {
    const interaction = getInteraction(s.resourceId);
    return interaction?.status === 'completed';
  }).length;

  const progressPercentage = pathSteps.length > 0 
    ? (completedSteps / pathSteps.length) * 100 
    : 0;

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2">
          <Route className="w-8 h-8" />
          Your Learning Path
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          A personalized sequence of resources to achieve your learning goals
        </p>
      </div>

      {/* Progress Summary */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Overall Progress</p>
              <p className="text-2xl">
                {completedSteps} of {pathSteps.length} completed
              </p>
            </div>
            <div className="text-right">
              <Badge variant={progressPercentage === 100 ? 'default' : 'secondary'}>
                {progressPercentage.toFixed(0)}%
              </Badge>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </CardContent>
      </Card>

      {pathSteps.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Route className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="mb-2">No Learning Path Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Complete your onboarding to generate a personalized learning path
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Timeline View */
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-6">
            {pathSteps.map((step, index) => {
              const resource = mockResources.find(r => r.id === step.resourceId);
              if (!resource) return null;

              const interaction = getInteraction(resource.id);
              const isCompleted = interaction?.status === 'completed';
              const isInProgress = interaction?.status === 'in-progress';
              const isUnlocked = isStepUnlocked(step);

              return (
                <div key={step.id} className="relative">
                  {/* Timeline node */}
                  <div
                    className={`absolute left-8 w-4 h-4 rounded-full border-4 transform -translate-x-1/2 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500'
                        : isInProgress
                        ? 'bg-indigo-500 border-indigo-500'
                        : isUnlocked
                        ? 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'
                        : 'bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-700'
                    }`}
                  />

                  {/* Content Card */}
                  <div className="ml-20">
                    <Card className={!isUnlocked ? 'opacity-60' : ''}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="capitalize">
                                {getTypeIcon(resource.type)}
                                <span className="ml-1">{resource.type}</span>
                              </Badge>
                              <Badge
                                className={
                                  resource.difficulty === 'Beginner'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                    : resource.difficulty === 'Intermediate'
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                }
                              >
                                {resource.difficulty}
                              </Badge>
                              {isCompleted && (
                                <Badge className="bg-green-500">
                                  <Check className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                              {isInProgress && (
                                <Badge variant="secondary">In Progress</Badge>
                              )}
                            </div>

                            <h3 className="mb-2">
                              {index + 1}. {resource.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              {resource.description}
                            </p>

                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{resource.duration}</span>
                              </div>
                              {step.prerequisite && (
                                <div className="flex items-center gap-1">
                                  <Lock className="w-4 h-4" />
                                  <span>Requires previous step</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {!isUnlocked ? (
                              <Button disabled size="sm">
                                <Lock className="w-4 h-4 mr-2" />
                                Locked
                              </Button>
                            ) : isCompleted ? (
                              <Button variant="outline" size="sm" disabled>
                                <Check className="w-4 h-4 mr-2" />
                                Completed
                              </Button>
                            ) : isInProgress ? (
                              <Button
                                size="sm"
                                onClick={() => handleMarkComplete(step)}
                              >
                                Mark Complete
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleStartLearning(step)}
                              >
                                Start Learning
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};