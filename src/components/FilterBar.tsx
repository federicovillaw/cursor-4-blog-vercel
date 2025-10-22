import { Post } from '@/hooks/usePosts';

/**
 * FilterBar Component
 *
 * This component displays filter options based on the unique authors and tags
 * found in the provided posts. It allows users to filter the post feed.
 */
interface FilterBarProps {
  posts: Post[];
  activeFilter: { type: 'author' | 'tag'; value: string } | null;
  onFilterChange: (type: 'author' | 'tag', value: string) => void;
  onClearFilter: () => void;
}

const FilterBar = ({ posts, activeFilter, onFilterChange, onClearFilter }: FilterBarProps) => {
  // Extract unique authors and tags from the posts
  const authors = [...new Set(posts.map((post) => post.authorName))];
  const tags = [...new Set(posts.map((post) => post.programTag))];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
      <h3 className="text-lg font-semibold mb-3">Filter Posts</h3>
      
      {activeFilter && (
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            Currently filtering by {activeFilter.type}: <strong>{activeFilter.value}</strong>
          </span>
          <button 
            onClick={onClearFilter} 
            className="ml-2 text-sm text-blue-500 hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Filter by Author */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">By Author:</h4>
        <div className="flex flex-wrap gap-2">
          {authors.map((author) => (
            <button
              key={author}
              onClick={() => onFilterChange('author', author)}
              className={`px-3 py-1 text-sm rounded-full ${
                activeFilter?.value === author ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {author}
            </button>
          ))}
        </div>
      </div>

      {/* Filter by Tag */}
      <div>
        <h4 className="font-medium mb-2">By Tool/Tag:</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onFilterChange('tag', tag)}
              className={`px-3 py-1 text-sm rounded-full ${
                activeFilter?.value === tag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
