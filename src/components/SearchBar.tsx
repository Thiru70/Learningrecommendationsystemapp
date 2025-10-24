import React, { useState, useEffect } from 'react';
import { Search, Loader2, History } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { apiService, SearchResult } from '../lib/apiService';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAuth } from '../context/UserContext';

interface SearchBarProps {
  onSearchResults: (results: SearchResult[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  // Get suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        const results = await apiService.getSearchSuggestions(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || !user) return;

    setIsSearching(true);
    setShowSuggestions(false);

    try {
      const results = await apiService.semanticSearch(searchQuery, user.id);
      onSearchResults(results);

      // Save to search history
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <Popover open={showSuggestions && (suggestions.length > 0 || searchHistory.length > 0)} onOpenChange={setShowSuggestions}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search using natural language (e.g., 'How do I learn Python?')"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 pr-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-600 animate-spin" />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
          <Command>
            <CommandList>
              {suggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSuggestionClick(suggestion)}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {searchHistory.length > 0 && suggestions.length === 0 && (
                <CommandGroup heading="Recent Searches">
                  {searchHistory.slice(0, 5).map((historyItem, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSuggestionClick(historyItem)}
                    >
                      <History className="w-4 h-4 mr-2" />
                      {historyItem}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {suggestions.length === 0 && searchHistory.length === 0 && query.length > 2 && (
                <CommandEmpty>No suggestions found</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};