import React, { useState } from 'react';
import { MicroTask } from '../lib/microTaskData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TaskFeedbackProps {
  task: MicroTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (taskId: string, helpful: boolean, comment?: string) => void;
}

export const TaskFeedback: React.FC<TaskFeedbackProps> = ({
  task,
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');

  if (!task) return null;

  const handleSubmit = () => {
    if (helpful === null) {
      toast.error('Please indicate if this task was helpful');
      return;
    }

    onSubmitFeedback(task.id, helpful, comment);
    
    // Reset state
    setHelpful(null);
    setComment('');
    onClose();
    
    toast.success('Thank you for your feedback!');
  };

  const handleSkip = () => {
    setHelpful(null);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleSkip}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How was this task?</DialogTitle>
          <DialogDescription>
            Your feedback helps us recommend better tasks for you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="font-medium mb-1">{task.title}</p>
            <p className="text-gray-600 dark:text-gray-400">
              {task.description}
            </p>
          </div>

          {/* Helpful Question */}
          <div className="space-y-3">
            <p className="font-medium">Was this task helpful?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setHelpful(true)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  helpful === true
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <ThumbsUp
                  className={`w-8 h-8 mx-auto mb-2 ${
                    helpful === true
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400'
                  }`}
                />
                <p className="font-medium">Yes</p>
              </button>
              <button
                onClick={() => setHelpful(false)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  helpful === false
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <ThumbsDown
                  className={`w-8 h-8 mx-auto mb-2 ${
                    helpful === false
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-400'
                  }`}
                />
                <p className="font-medium">No</p>
              </button>
            </div>
          </div>

          {/* ML Explanation */}
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-indigo-900 dark:text-indigo-100 mb-1">
                  Why was this recommended?
                </p>
                <p className="text-indigo-700 dark:text-indigo-300">
                  This task was chosen because {task.recommendationReason.toLowerCase()}.
                  Your feedback helps our AI improve future recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* Optional Comment */}
          <div className="space-y-2">
            <label className="font-medium">
              Additional comments (optional)
            </label>
            <Textarea
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            Skip
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
