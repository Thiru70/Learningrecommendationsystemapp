import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { OnboardingData } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Badge } from '../components/ui/badge';
import { Target, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const AVAILABLE_INTERESTS = [
  'Machine Learning',
  'Web Development',
  'Data Science',
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'Database Design',
  'Cloud Computing',
  'DevOps',
  'Mobile Development',
  'UI/UX Design',
];

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [learningGoal, setLearningGoal] = useState('');
  const [goalTimeline, setGoalTimeline] = useState('3 months');
  
  const { completeOnboarding } = useUser();
  const navigate = useNavigate();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step === 1 && interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }
    
    if (step === 3 && !learningGoal.trim()) {
      toast.error('Please enter your learning goal');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    const data: OnboardingData = {
      interests,
      skillLevel,
      learningGoal,
      goalTimeline,
    };

    try {
      await completeOnboarding(data);
      toast.success('Profile set up successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to complete onboarding');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Target className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="mb-2">Let's Personalize Your Learning</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Step {step} of {totalSteps}
            </p>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="mb-8 h-2" />

          {/* Step 1: Interests */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-2">What interests you?</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select topics you'd like to learn (choose at least one)
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AVAILABLE_INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      interests.includes(interest)
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{interest}</span>
                      {interests.includes(interest) && (
                        <Check className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {interests.length > 0 && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                  <p className="font-medium mb-2">Selected ({interests.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Skill Level */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-2">What's your current skill level?</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This helps us recommend the right content for you
                </p>
              </div>

              <RadioGroup value={skillLevel} onValueChange={(value: any) => setSkillLevel(value)}>
                <div className="space-y-3">
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <label
                      key={level}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        skillLevel === level
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value={level} id={level} className="mr-4" />
                      <div>
                        <p className="font-medium">{level}</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {level === 'Beginner' && "I'm just starting out"}
                          {level === 'Intermediate' && "I have some experience"}
                          {level === 'Advanced' && "I'm experienced and want to deepen my skills"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Learning Goal */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="mb-2">What's your learning goal?</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Set a goal to stay motivated and track your progress
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Your Goal</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Master React and build a portfolio website"
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <RadioGroup value={goalTimeline} onValueChange={setGoalTimeline}>
                    <div className="grid grid-cols-2 gap-3">
                      {['1 month', '3 months', '6 months', '1 year'].map(timeline => (
                        <label
                          key={timeline}
                          className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            goalTimeline === timeline
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <RadioGroupItem value={timeline} id={timeline} className="sr-only" />
                          <span className="font-medium">{timeline}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button onClick={handleNext}>
              {step === totalSteps ? (
                <>
                  Complete
                  <Check className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
