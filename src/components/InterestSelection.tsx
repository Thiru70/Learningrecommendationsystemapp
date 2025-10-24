import React, { useState } from 'react';
import { useAuth } from '../context/UserContext';
import { availableInterests } from '../lib/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';

interface InterestSelectionProps {
  onComplete: () => void;
}

export const InterestSelection: React.FC<InterestSelectionProps> = ({ onComplete }) => {
  const { user, updateInterests } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = () => {
    updateInterests(selectedInterests);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-3xl">
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
              onClick={handleSubmit}
              disabled={selectedInterests.length < 3}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};