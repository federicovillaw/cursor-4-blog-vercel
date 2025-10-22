import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define the structure of a Post object based on the PRD's data model
export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  mediaUrl: string;
  achievedText: string;
  reflectionText: string;
  programTag: string;
  createdAt: Timestamp;
  isFeatured: boolean;
}

/**
 * Custom hook to fetch and listen for real-time updates to the posts collection in Firestore.
 */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Note: The PRD specifies a complex path: /artifacts/__app_id/public/data/posts
    // For this implementation, I am using a simplified 'posts' collection.
    // This will need to be updated with the final path structure.
    const postsCollectionRef = collection(db, 'posts');
    
    // Query to get all posts, ordered by creation date (newest first)
    const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const postsData: Post[] = [];
        querySnapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() } as Post);
        });
        setPosts(postsData);
        setLoading(false);
      }, 
      (err) => {
        console.error("Error fetching posts:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { posts, loading, error };
}
