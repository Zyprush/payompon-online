"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase'; // Import `db` to access Firestore
import { collection, query, where, getDocs } from 'firebase/firestore';

export const LoggedIn: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const userCheck = async () => {
      if (user) {
        try {
          // Query the users collection where the id field matches the current user's UID
          const userQuery = query(
            collection(db, 'users'),
            where('id', '==', user.uid)
          );
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
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
      }
    };

    userCheck();
  }, [user, router]);

  return null; // This component doesn't render anything
};
