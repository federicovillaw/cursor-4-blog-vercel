'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Post } from '@/hooks/usePosts';
import { X } from 'lucide-react';

/**
 * PostFormModal Component
 *
 * This component provides a form within a modal for creating and editing posts.
 * It includes validation to ensure all required fields are filled.
 */
interface PostFormModalProps {
  postToEdit?: Post | null;
  onClose: () => void;
}

const PostFormModal = ({ postToEdit, onClose }: PostFormModalProps) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    mediaUrl: '',
    achievedText: '',
    reflectionText: '',
    programTag: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If we are editing a post, populate the form with its data
  useEffect(() => {
    if (postToEdit) {
      setFormData({
        mediaUrl: postToEdit.mediaUrl,
        achievedText: postToEdit.achievedText,
        reflectionText: postToEdit.reflectionText,
        programTag: postToEdit.programTag,
      });
    }
  }, [postToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a post.');
      return;
    }

    // Validation
    if (!formData.mediaUrl || !formData.achievedText || !formData.reflectionText || !formData.programTag) {
      setError('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (postToEdit) {
        // Update existing post
        const postRef = doc(db, 'posts', postToEdit.id);
        await updateDoc(postRef, { ...formData });
      } else {
        // Create new post
        await addDoc(collection(db, 'posts'), {
          ...formData,
          authorId: user.uid,
          authorName: user.displayName || 'Anonymous',
          createdAt: serverTimestamp(),
          isFeatured: false,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to submit post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{postToEdit ? 'Edit Post' : 'Create a New Post'}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields */}
            <div>
              <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700">Media URL (Image, Video, Drive Link)</label>
              <input type="url" name="mediaUrl" id="mediaUrl" value={formData.mediaUrl} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="achievedText" className="block text-sm font-medium text-gray-700">What did you achieve?</label>
              <textarea name="achievedText" id="achievedText" value={formData.achievedText} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
              <label htmlFor="reflectionText" className="block text-sm font-medium text-gray-700">What did you learn? (Reflection)</label>
              <textarea name="reflectionText" id="reflectionText" value={formData.reflectionText} onChange={handleChange} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
              <label htmlFor="programTag" className="block text-sm font-medium text-gray-700">Program/Team Tag (e.g., Figma, Team B)</label>
              <input type="text" name="programTag" id="programTag" value={formData.programTag} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="flex justify-end pt-4">
              <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-blue-300">
                {isSubmitting ? 'Submitting...' : (postToEdit ? 'Save Changes' : 'Publish Post')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostFormModal;
