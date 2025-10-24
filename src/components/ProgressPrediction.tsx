import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/UserContext';
import { apiService, ProgressPrediction as ProgressPredictionType } from '../lib/apiService';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';

export const ProgressPrediction: React.FC = () => {
  const { user } = useAuth();
  const [prediction, setPrediction] = useState<ProgressPredictionType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPrediction();
    }
  }, [user]);

  const loadPrediction = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await apiService.getProgressPrediction(user.id);
      setPrediction(data);
    } catch (error) {
      console.error('Failed to load progress prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !prediction) return null;

  const getVariant = () => {
    switch (prediction.status) {
      case 'on-track':
        return 'default';
      case 'at-risk':
        return 'warning';
      case 'behind':
        return 'destructive';
    }
  };

  const getIcon = () => {
    switch (prediction.status) {
      case 'on-track':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'at-risk':
        return <TrendingUp className="h-5 w-5" />;
      case 'behind':
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getTitle = () => {
    switch (prediction.status) {
      case 'on-track':
        return "You're On Track! 🎉";
      case 'at-risk':
        return 'Attention Needed ⚠️';
      case 'behind':
        return "Let's Get Back on Track 📚";
    }
  };

  return (
    <Alert variant={getVariant() as any} className="mb-6">
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTitle className="mb-0">{getTitle()}</AlertTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-2">Prediction Factors:</p>
                  <ul className="space-y-1">
                    {prediction.factors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 pt-2 border-t">
                    Confidence: {(prediction.confidence * 100).toFixed(0)}%
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Badge variant="secondary" className="ml-auto">
              {(prediction.confidence * 100).toFixed(0)}% confident
            </Badge>
          </div>
          <AlertDescription>
            {prediction.message}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};