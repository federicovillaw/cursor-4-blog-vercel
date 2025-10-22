import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithCustomToken, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Define the structure of our user object, including the role
interface AppUser extends User {
  role?: 'Student' | 'Instructor' | 'TA';
}

/**
 * Custom hook to manage user authentication state and role.
 * It listens to Firebase auth state changes and fetches the user's role
 * from Firestore.
 */
export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, now fetch their role.
        const userDocRef = doc(db, `users/${firebaseUser.uid}`); // Simplified path for example
        const userDoc = await getDoc(userDocRef);

        const userData: AppUser = {
          ...firebaseUser,
          // Note: The PRD specifies a complex path for roles.
          // This will need to be adjusted based on the final __app_id implementation.
          role: userDoc.exists() ? userDoc.data().role : 'Student',
        };
        setUser(userData);
      } else {
        // User is signed out.
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Signs in the user with a custom token.
   * As per the PRD, this uses a globally available __initial_auth_token.
   * @param token The custom token for authentication.
   */
  const signIn = async (token: string) => {
    setLoading(true);
    try {
      await signInWithCustomToken(auth, token);
    } catch (error) {
      console.error("Error signing in with custom token:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signIn };
}
