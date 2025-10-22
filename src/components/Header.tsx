'use client';

import { Plus } from 'lucide-react';

/**
 * Header Component
 * 
 * This component displays the main header for the application, including
 * the title and a "Create Post" button.
 */
interface HeaderProps {
  onCreatePost: () => void;
}

const Header = ({ onCreatePost }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Prototype Reflection Hub
        </h1>
        <button
          onClick={onCreatePost}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Post
        </button>
      </div>
    </header>
  );
};

export default Header;
