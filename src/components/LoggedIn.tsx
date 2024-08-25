"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase'; // Import `db` to access Firestore
import { doc, getDoc } from 'firebase/firestore';

export const LoggedIn: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const userCheck = async () => {
      if (user) {
        try {
          // Access the document directly using the user's UID as the document ID
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userDoc = docSnap.data();
            // Check if user role is 'resident'
            if (userDoc.role === 'resident') {
              router.push('/user/dashboard');
            } else {
              router.push('/admin/dashboard');
            }
          } else {
            // Handle case where user document does not exist
            console.error('User document not found');
            router.push('/admin/dashboard');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/admin/dashboard');
        }
      } else {
        // Handle case where user is not authenticated
        console.error('User not authenticated');
        router.push('/admin/dashboard');
      }
    };

    userCheck();
  }, [user, router]);

  return null; // This component doesn't render anything
};
