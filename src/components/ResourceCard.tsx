import React, { useState } from 'react';
import { LearningResource } from '../lib/mockData';
import { useAuth } from '../context/UserContext';
import { apiService } from '../lib/apiService';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  Clock,
  Star,
  PlayCircle,
  FileText,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ResourceCardProps {
  resource: LearningResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { updateInteraction, getInteraction } = useAuth();
  const interaction = getInteraction(resource.id);
  const [showRating, setShowRating] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState('');

  const handleLike = async () => {
    updateInteraction(resource.id, { liked: !interaction?.liked });
    await apiService.submitFeedback(resource.id, { liked: !interaction?.liked });
    toast.success(interaction?.liked ? 'Like removed' : 'Liked!');
  };

  const handleDislike = async () => {
    updateInteraction(resource.id, { liked: false });
    await apiService.submitFeedback(resource.id, { liked: false });
    toast.success('Feedback submitted');
  };

  const handleBookmark = () => {
    updateInteraction(resource.id, {
      bookmarked: !interaction?.bookmarked,
    });
    toast.success(interaction?.bookmarked ? 'Bookmark removed' : 'Bookmarked!');
  };

  const handleRate = async (rating: number) => {
    updateInteraction(resource.id, { rating });
    await apiService.submitFeedback(resource.id, { rating });
    setShowRating(false);
    toast.success(`Rated ${rating} stars!`);
  };

  const handleStatusChange = async (status: 'not-started' | 'in-progress' | 'completed') => {
    updateInteraction(resource.id, {
      status,
      completedAt: status === 'completed' ? new Date() : undefined,
      viewedAt: new Date(),
    });
    await apiService.submitFeedback(resource.id, { completed: status === 'completed' });
    toast.success(`Status updated: ${status.replace('-', ' ')}`);
  };

  const handleStartLearning = () => {
    updateInteraction(resource.id, {
      status: 'in-progress',
      viewedAt: new Date(),
    });
    toast.success('Started learning!');
  };

  const handleSubmitReview = async () => {
    if (!review.trim()) return;
    
    await apiService.submitFeedback(resource.id, { review });
    setShowReview(false);
    setReview('');
    toast.success('Review submitted! Thank you for your feedback.');
  };

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'course':
        return <GraduationCap className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = () => {
    switch (resource.difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {resource.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <ImageWithFallback
            src={resource.imageUrl}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="pt-4">
        <div className="flex items-start gap-2 mb-2">
          <Badge variant="outline" className="capitalize">
            <span className="mr-1">{getTypeIcon()}</span>
            {resource.type}
          </Badge>
          <Badge className={getDifficultyColor()}>{resource.difficulty}</Badge>
        </div>
        <h3 className="mb-2">{resource.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-3">{resource.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {resource.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{resource.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{resource.likes}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3 pt-0">
        <div className="flex items-center gap-2 w-full">
          <Button
            variant={interaction?.liked ? 'default' : 'outline'}
            size="sm"
            onClick={handleLike}
            className="flex-1"
          >
            <ThumbsUp className="w-4 h-4 mr-1" />
            Like
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDislike}
            className="flex-1"
          >
            <ThumbsDown className="w-4 h-4 mr-1" />
            Dislike
          </Button>
          <Button
            variant={interaction?.bookmarked ? 'default' : 'outline'}
            size="sm"
            onClick={handleBookmark}
          >
            {interaction?.bookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <Select
            value={interaction?.status || 'not-started'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {!showRating && !interaction?.rating && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRating(true)}
            >
              <Star className="w-4 h-4 mr-1" />
              Rate
            </Button>
          )}
          {interaction?.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < interaction.rating!
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {showRating && (
          <div className="flex items-center gap-2 w-full">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className="flex-1 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Star className="w-5 h-5 mx-auto fill-yellow-400 text-yellow-400" />
                <span className="block mt-1">{rating}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Review Dialog */}
        <Dialog open={showReview} onOpenChange={setShowReview}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Leave a Review
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your thoughts about {resource.title}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Textarea
                placeholder="What did you think about this resource? (optional)"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReview(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview} disabled={!review.trim()}>
                  Submit Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {!interaction?.status || interaction?.status === 'not-started' ? (
          <Button onClick={handleStartLearning} className="w-full">
            Start Learning
          </Button>
        ) : (
          <Button variant="secondary" className="w-full">
            Continue Learning
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};