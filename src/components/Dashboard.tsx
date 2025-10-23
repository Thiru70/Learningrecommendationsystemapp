import React, { useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { mockResources } from '../lib/mockData';
import { ResourceCard } from './ResourceCard';
import { SearchBar } from './SearchBar';
import { ProgressPrediction } from './ProgressPrediction';
import { SearchResult } from '../lib/apiService';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<'recommended' | 'likes' | 'newest'>('recommended');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    mockResources.forEach((resource) => {
      resource.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = [...mockResources];

    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((r) => selectedTypes.includes(r.type));
    }

    // Filter by difficulty
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((r) => selectedDifficulties.includes(r.difficulty));
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((r) =>
        r.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    // Sort
    if (sortBy === 'likes') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortBy === 'recommended' && user?.interests) {
      // Sort by relevance to user interests
      filtered.sort((a, b) => {
        const aScore = a.tags.filter((tag) => user.interests.includes(tag)).length;
        const bScore = b.tags.filter((tag) => user.interests.includes(tag)).length;
        return bScore - aScore;
      });
    }

    return filtered;
  }, [selectedTypes, selectedDifficulties, selectedTags, sortBy, user?.interests]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedDifficulties([]);
    setSelectedTags([]);
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const activeFiltersCount = selectedTypes.length + selectedDifficulties.length + selectedTags.length;

  // Use search results if available, otherwise use filtered resources
  const displayResources = searchResults 
    ? searchResults.map(sr => sr.resource)
    : filteredResources;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Progress Prediction Alert */}
      <ProgressPrediction />

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar onSearchResults={handleSearchResults} />
      </div>

      <div className="mb-6">
        <h1 className="mb-2">
          {searchResults ? 'Search Results' : 'Learning Recommendations'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {searchResults 
            ? `Found ${searchResults.length} results`
            : 'Personalized resources based on your interests'
          }
        </p>
      </div>

      {/* Clear Search Button */}
      {searchResults && (
        <div className="mb-4">
          <Button variant="outline" onClick={clearSearch}>
            <X className="w-4 h-4 mr-2" />
            Clear Search
          </Button>
        </div>
      )}

      {/* Filters and Sort Bar - Only show when not in search mode */}
      {!searchResults && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 px-1.5 py-0.5 h-5 min-w-5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Resources</SheetTitle>
                <SheetDescription>
                  Refine your learning recommendations
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Type Filter */}
                <div>
                  <h3 className="mb-3">Type</h3>
                  <div className="space-y-2">
                    {['video', 'article', 'course'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <Label htmlFor={type} className="capitalize cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h3 className="mb-3">Difficulty</h3>
                  <div className="space-y-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((difficulty) => (
                      <div key={difficulty} className="flex items-center space-x-2">
                        <Checkbox
                          id={difficulty}
                          checked={selectedDifficulties.includes(difficulty)}
                          onCheckedChange={() => toggleDifficulty(difficulty)}
                        />
                        <Label htmlFor={difficulty} className="cursor-pointer">
                          {difficulty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <h3 className="mb-3">Topics</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {allTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => toggleTag(tag)}
                        />
                        <Label htmlFor={tag} className="cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="likes">Most Liked</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedTypes.map((type) => (
            <Badge key={type} variant="secondary" className="cursor-pointer" onClick={() => toggleType(type)}>
              {type} ×
            </Badge>
          ))}
          {selectedDifficulties.map((difficulty) => (
            <Badge key={difficulty} variant="secondary" className="cursor-pointer" onClick={() => toggleDifficulty(difficulty)}>
              {difficulty} ×
            </Badge>
          ))}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => toggleTag(tag)}>
              {tag} ×
            </Badge>
          ))}
        </div>
      )}

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {displayResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {searchResults 
              ? 'No results found. Try a different search query.'
              : 'No resources found matching your filters. Try adjusting your search criteria.'
            }
          </p>
        </div>
      )}
    </div>
  );
};