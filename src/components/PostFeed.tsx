'use client';

import { useState, useMemo } from 'react';
import { usePosts, Post } from '@/hooks/usePosts';
import PostCard from './PostCard';
import PostModal from './PostModal';
import PostFormModal from './PostFormModal';
import FilterBar from './FilterBar';

/**
 * PostFeed Component
 * 
 * This component fetches and displays the grid of posts. It also manages
 * the state for the post expansion modal, determining which post is currently
 * selected to be viewed in detail.
 */
const PostFeed = () => {
  const { posts, loading, error } = usePosts();
  const [modalPost, setModalPost] = useState<Post | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [activeFilter, setActiveFilter] = useState<{ type: 'author' | 'tag'; value: string } | null>(null);

  const handleCardClick = (post: Post) => {
    setModalPost(post);
  };

  const handleCloseModal = () => {
    setModalPost(null);
  };

  const handleEditClick = () => {
    setPostToEdit(modalPost);
    setModalPost(null); // Close the view modal
  };

  const handleCloseForm = () => {
    setPostToEdit(null);
  };
  
  const handleFilterChange = (type: 'author' | 'tag', value: string) => {
    setActiveFilter({ type, value });
  };

  const handleClearFilter = () => {
    setActiveFilter(null);
  };

  // Memoize the filtered posts to avoid re-calculating on every render
  const filteredPosts = useMemo(() => {
    if (!activeFilter) {
      return posts;
    }
    return posts.filter((post) => {
      if (activeFilter.type === 'author') {
        return post.authorName === activeFilter.value;
      }
      if (activeFilter.type === 'tag') {
        return post.programTag === activeFilter.value;
      }
      return true;
    });
  }, [posts, activeFilter]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading posts. Please try again later.</p>;
  }

  if (posts.length === 0) {
    return <p className="text-center text-gray-500">No posts have been made yet.</p>;
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto py-8">
        <FilterBar 
          posts={posts} 
          activeFilter={activeFilter} 
          onFilterChange={handleFilterChange} 
          onClearFilter={handleClearFilter}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onClick={() => handleCardClick(post)} />
          ))}
        </div>
        {filteredPosts.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-8">No posts match the current filter.</p>
        )}
      </div>

      {modalPost && <PostModal post={modalPost} onClose={handleCloseModal} onEdit={handleEditClick} />}
      {postToEdit && <PostFormModal postToEdit={postToEdit} onClose={handleCloseForm} />}
    </>
  );
};

export default PostFeed;
