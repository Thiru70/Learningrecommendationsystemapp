import React from 'react';
import { useAuth } from '../context/UserContext';
import { mockResources } from '../lib/mockData';
import { ResourceCard } from './ResourceCard';
import { Bookmark } from 'lucide-react';

export const Bookmarks: React.FC = () => {
  const { user } = useAuth();

  const bookmarkedResources = mockResources.filter(
    (resource) => user?.interactions[resource.id]?.bookmarked
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="mb-2 flex items-center gap-2">
          <Bookmark className="w-8 h-8" />
          Bookmarked Resources
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Resources you've saved for later
        </p>
      </div>

      {bookmarkedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="mb-2">No bookmarks yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start bookmarking resources to save them for later
          </p>
        </div>
      )}
    </div>
  );
};