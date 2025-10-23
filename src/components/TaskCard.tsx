import React from 'react';
import { MicroTask } from '../lib/microTaskData';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Clock,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface TaskCardProps {
  task: MicroTask;
  onStart: (task: MicroTask) => void;
  onLearnMore: (task: MicroTask) => void;
  isCompleted?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStart,
  onLearnMore,
  isCompleted,
}) => {
  const getDifficultyColor = () => {
    switch (task.difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    }
  };

  const getReasonIcon = () => {
    if (task.recommendationReason.includes('quiz')) {
      return '📝';
    } else if (task.recommendationReason.includes('path')) {
      return '🎯';
    } else if (task.recommendationReason.includes('AI')) {
      return '🤖';
    } else if (task.recommendationReason.includes('learners')) {
      return '👥';
    } else {
      return '✨';
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all ${isCompleted ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : ''}`}>
      <CardContent className="pt-6">
        {isCompleted && (
          <div className="flex items-center gap-2 mb-3 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Completed</span>
          </div>
        )}
        
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="flex-1">{task.title}</h3>
          <Badge className={getDifficultyColor()}>
            {task.difficulty}
          </Badge>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {task.description}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{task.estimatedTime}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {task.category}
          </Badge>
        </div>

        <div className="flex items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-indigo-900 dark:text-indigo-100">
              <span className="mr-1">{getReasonIcon()}</span>
              {task.recommendationReason}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        {!isCompleted && (
          <>
            <Button
              onClick={() => onStart(task)}
              className="flex-1"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button
              variant="outline"
              onClick={() => onLearnMore(task)}
            >
              <Info className="w-4 h-4 mr-2" />
              How-To
            </Button>
          </>
        )}
        {isCompleted && (
          <Button
            variant="outline"
            onClick={() => onLearnMore(task)}
            className="flex-1"
          >
            <Info className="w-4 h-4 mr-2" />
            Review Steps
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
