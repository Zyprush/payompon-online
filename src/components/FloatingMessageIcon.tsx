import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase';
import Message from './Message';
import { IconMessage } from '@tabler/icons-react';

interface UserData {
    unreadCounts?: Record<string, number>;
}

const FloatingMessageIcon: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    // add random number 1-5 haha
    const random = Math.floor(Math.random() * 3);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
                
                // Calculate total unread count
                const unreadCounts = userData.unreadCounts || {};
                const totalCount = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

                console.log("Total Unread Count:", totalCount);
                
                setTotalUnreadCount(totalCount);
                
                // Check if there are any messages at all
                const hasMessages = Object.keys(unreadCounts).length > 0;
                setHasNewMessage(hasMessages);
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
                <IconMessage size={24} />
                {(totalUnreadCount > 0 || hasNewMessage) && (
                    <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center 
                        animate-pulse hover:animate-none transition-all duration-300">
                        {totalUnreadCount > 0 ? totalUnreadCount : '0'}
                    </span>
                )}
            </button>
            <Message isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default FloatingMessageIcon;