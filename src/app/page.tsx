'use client';

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import PostFeed from "@/components/PostFeed";
import Header from "@/components/Header";
import PostFormModal from "@/components/PostFormModal";

export default function Home() {
  const { user, loading } = useAuthContext();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreatePost = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <main className="min-h-screen">
      {user && <Header onCreatePost={handleCreatePost} />}
      
      <div className="container mx-auto px-4 py-8">
        {!user && !loading && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Prototype Reflection Hub</h1>
            <p className="text-xl text-gray-600">Please sign in to view and create posts.</p>
          </div>
        )}

        {loading && <p className="text-lg text-center text-gray-500">Loading...</p>}
        
        {user && !loading && <PostFeed />}
      </div>
      
      {isFormOpen && <PostFormModal onClose={handleCloseForm} />}
    </main>
  );
}
