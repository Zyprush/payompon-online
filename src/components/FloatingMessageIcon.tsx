import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase';
import Message from './Message';

interface UserData {
  unreadCounts?: Record<string, number>;
  // Add other fields that might be in your user document
}

const FloatingMessageIcon: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [hasNewMessage, setHasNewMessage] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserId(user.uid);
            } else {
                setCurrentUserId(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentUserId) return;

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('id', '==', currentUserId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const userData = snapshot.docs[0].data() as UserData;
                const totalUnreadCount = Object.values(userData.unreadCounts || {}).reduce((a, b) => a + b, 0);
                setUnreadCount(totalUnreadCount);
                setHasNewMessage(totalUnreadCount > 0);
            }
        });

        return () => unsubscribe();
    }, [currentUserId]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
            >
                <MessageCircle size={24} />
                {hasNewMessage && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            <Message isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default FloatingMessageIcon;