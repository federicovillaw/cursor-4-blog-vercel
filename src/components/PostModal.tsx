'use client';

import { Post } from '@/hooks/usePosts';
import Image from 'next/image';
import { X, Edit, Trash2 } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * PostModal Component
 *
 * This component displays the full details of a selected post in a large
 * modal overlay. It handles different media types and provides clear
 * options for closing the modal.
 */
interface PostModalProps {
  post: Post;
  onClose: () => void;
  onEdit: () => void;
}

const PostModal = ({ post, onClose, onEdit }: PostModalProps) => {
  const { user } = useAuthContext();

  // Determine user permissions
  const isAuthor = user && user.uid === post.authorId;
  const isAdmin = user && (user.role === 'Instructor' || user.role === 'TA');
  const canEdit = isAuthor || isAdmin;
  const canDelete = isAuthor || isAdmin;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'posts', post.id));
        onClose(); // Close the modal after deletion
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post. Please try again.");
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isImage = post.mediaUrl.match(/\.(jpeg|jpg|gif|png)$/);

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <X size={24} />
        </button>

        <div className="md:grid md:grid-cols-2">
          {/* Media Section */}
          <div className="w-full h-64 md:h-full bg-gray-100 flex items-center justify-center">
            {isImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={post.mediaUrl}
                  alt={post.achievedText}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            ) : (
              <iframe
                src={post.mediaUrl}
                title="Embedded Media"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">{post.achievedText}</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Reflection/Learning</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{post.reflectionText}</p>
            </div>

            <div className="text-sm text-gray-500">
              <p>Author: <span className="font-medium text-gray-700">{post.authorName}</span></p>
              <p>Tool/Tag: <span className="font-medium text-gray-700">{post.programTag}</span></p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mt-6">
              {canEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Edit size={16} className="mr-2" /> Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
