import React, { useState } from 'react';
import { useAuth } from '../context/UserContext';
import { availableInterests } from '../lib/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Check, Target, TrendingUp, Calendar } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { LearningGoal } from '../lib/apiService';

interface EnhancedOnboardingProps {
  onComplete: () => void;
}

export const EnhancedOnboarding: React.FC<EnhancedOnboardingProps> = ({ onComplete }) => {
  const { user, updateInterests, updateSkillLevel, updateGoals } = useAuth();
  const [step, setStep] = useState(1);
  
  // Step 1: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  
  // Step 2: Skill Level
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    user?.skillLevel || 'Beginner'
  );
  
  // Step 3: Goals
  const [goalText, setGoalText] = useState('');
  const [goalMonths, setGoalMonths] = useState('3');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      updateInterests(selectedInterests);
      setStep(2);
    } else if (step === 2) {
      updateSkillLevel(skillLevel);
      setStep(3);
    }
  };

  const handleComplete = () => {
    const goals: LearningGoal[] = goalText ? [{
      id: Date.now().toString(),
      goal: goalText,
      targetDate: new Date(Date.now() + parseInt(goalMonths) * 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 0,
    }] : [];
    
    updateGoals(goals);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-4xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 px-6 pt-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  s === step
                    ? 'bg-indigo-600 text-white'
                    : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    s < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <>
            <CardHeader className="text-center">
              <CardTitle>What would you like to learn?</CardTitle>
              <CardDescription>
                Select your interests to get personalized recommendations (choose at least 3)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {availableInterests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`
                        relative p-4 rounded-lg border-2 transition-all
                        ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className={isSelected ? 'text-indigo-700 dark:text-indigo-300' : ''}>
                        {interest}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedInterests.length} selected
                </p>
                <Button
                  onClick={handleNext}
                  disabled={selectedInterests.length < 3}
                >
                  Next Step
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Skill Level Assessment */}
        {step === 2 && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <CardTitle>What's your current skill level?</CardTitle>
              <CardDescription>
                This helps us recommend content at the right difficulty
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={skillLevel} onValueChange={(value: any) => setSkillLevel(value)}>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <RadioGroupItem value="Beginner" id="beginner" className="mt-1" />
                    <Label htmlFor="beginner" className="cursor-pointer flex-1">
                      <p className="font-semibold">Beginner</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        I'm new to these topics and want to start from the basics
                      </p>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <RadioGroupItem value="Intermediate" id="intermediate" className="mt-1" />
                    <Label htmlFor="intermediate" className="cursor-pointer flex-1">
                      <p className="font-semibold">Intermediate</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        I have some experience and want to deepen my knowledge
                      </p>
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <RadioGroupItem value="Advanced" id="advanced" className="mt-1" />
                    <Label htmlFor="advanced" className="cursor-pointer flex-1">
                      <p className="font-semibold">Advanced</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        I'm experienced and looking for advanced or specialized content
                      </p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Next Step
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Learning Goals */}
        {step === 3 && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <CardTitle>Set your learning goal</CardTitle>
              <CardDescription>
                Having a goal helps you stay motivated (you can skip this step)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal">What do you want to achieve?</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Learn data science, Master React, Become a full-stack developer"
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="timeline">Target timeline</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="timeline"
                      type="number"
                      min="1"
                      max="24"
                      value={goalMonths}
                      onChange={(e) => setGoalMonths(e.target.value)}
                      className="w-20"
                    />
                    <span>months</span>
                  </div>
                </div>

                {goalText && (
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-300 mt-0.5" />
                      <div>
                        <p className="font-semibold text-indigo-900 dark:text-indigo-100">
                          Your Goal
                        </p>
                        <p className="text-indigo-700 dark:text-indigo-300 mt-1">
                          {goalText} in {goalMonths} months
                        </p>
                        <p className="text-indigo-600 dark:text-indigo-400 mt-2">
                          Target date: {new Date(Date.now() + parseInt(goalMonths) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handleComplete}>
                    Skip
                  </Button>
                  <Button onClick={handleComplete}>
                    Complete Setup
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};