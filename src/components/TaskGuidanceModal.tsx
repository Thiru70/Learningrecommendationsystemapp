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
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TaskGuidanceModalProps {
  task: MicroTask | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (task: MicroTask) => void;
}

export const TaskGuidanceModal: React.FC<TaskGuidanceModalProps> = ({
  task,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  if (!task) return null;

  const totalSteps = task.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(task);
    setCurrentStep(0);
    onClose();
  };

  const handleCopyCode = (stepIndex: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(stepIndex);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const currentStepData = task.steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="mb-2">{task.title}</DialogTitle>
              <DialogDescription>{task.description}</DialogDescription>
            </div>
            <Badge className="shrink-0">
              {task.estimatedTime}
            </Badge>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="font-medium">
              {progress.toFixed(0)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {task.steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  index === currentStep
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    : index < currentStep
                    ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span className="whitespace-nowrap">{index + 1}</span>
              </button>
              {index < totalSteps - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                {currentStep + 1}
              </div>
              <h3>{currentStepData.title}</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Code Example */}
          {currentStepData.codeExample && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  Code Example
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyCode(currentStep, currentStepData.codeExample!)}
                >
                  {copiedCode === currentStep ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
                <code>{currentStepData.codeExample}</code>
              </pre>
            </div>
          )}

          {/* Video (if available and first step) */}
          {task.videoUrl && currentStep === 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">Video Tutorial</span>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <iframe
                  width="100%"
                  height="100%"
                  src={task.videoUrl}
                  title="Tutorial Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Task
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
