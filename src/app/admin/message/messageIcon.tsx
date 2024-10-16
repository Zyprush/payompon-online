import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase';
import Message from './page';


interface User {
    id: string;
    name: string;
    role: string;
    photoURL: string;
    unreadCount: number;
    lastMessageTimestamp: any;
}

const MessageIcon: React.FC = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Set current user
                setCurrentUser({
                    id: user.uid,
                    name: user.displayName || '',
                    role: '', // You might want to fetch this from your user document
                    photoURL: user.photoURL || '',
                    unreadCount: 0,
                    lastMessageTimestamp: null,
                });

                // Listen for changes in unread messages
                const unreadQuery = query(
                    collection(db, 'users'),
                    where('id', '==', user.uid)
                );

                const unsubscribeUnread = onSnapshot(unreadQuery, (snapshot) => {
                    if (!snapshot.empty) {
                        const userData = snapshot.docs[0].data() as User;
                        const totalUnread = Object.values(userData.unreadCount || {}).reduce((a, b) => a + b, 0);
                        setUnreadCount(totalUnread);
                    }
                });

                return () => unsubscribeUnread();
            } else {
                setCurrentUser(null);
                setUnreadCount(0);
            }
        });

        return () => unsubscribe();
    }, []);

    const toggleMessages = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={toggleMessages}
                    className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    <MessageCircle size={24} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </div>
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Messages</h2>
                            <button onClick={toggleMessages} className="text-gray-500 hover:text-gray-700">
                                &times;
                            </button>
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <Message />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageIcon;