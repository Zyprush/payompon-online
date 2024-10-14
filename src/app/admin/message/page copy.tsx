"use client";

import React, { useState, useEffect, useRef } from 'react';
import NavLayout from "@/components/NavLayout";
import { collection, query, onSnapshot, orderBy, where, addDoc, serverTimestamp, doc, getDoc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase';
import { Search, Send, Menu } from 'lucide-react';

interface User {
    id: string;
    name: string;
    role: string;
    photoURL: string;
}

interface Message {
    id: string;
    text: string;
    sender: string;
    receiver: string;
    timestamp: Timestamp;
    participants: string[];
    conversationId: string;
    read: boolean;
}

interface Conversation {
    userId: string;
    lastMessage: Message;
    unreadCount: number;
}

const Message: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnapshot = await getDoc(docRef);

                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data() as User;
                        setCurrentUser({
                            id: user.uid,
                            name: userData.name,
                            role: userData.role,
                            photoURL: userData.photoURL || 'https://example.com/avatar.jpg',
                        });
                    } else {
                        console.log("No matching user data found!");
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            } else {
                setCurrentUser(null);
            }
        });

        const usersQuery = query(collection(db, 'users'));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setUsers(usersData);
            filterUsers(usersData, currentUser);
        });

        return () => {
            unsubscribe();
            unsubscribeUsers();
        };
    }, []);

    const filterUsers = (allUsers: User[], currentUser: User | null) => {
        if (!currentUser) return;

        let filtered: User[];
        if (currentUser.role === 'resident') {
            filtered = allUsers.filter(user => ['admin', 'staff'].includes(user.role));
        } else if (['admin', 'staff'].includes(currentUser.role)) {
            filtered = allUsers.filter(user => user.id !== currentUser.id);
        } else {
            filtered = [];
        }

        setFilteredUsers(filtered);
    };

    useEffect(() => {
        filterUsers(users, currentUser);
    }, [currentUser, users]);

    useEffect(() => {
        if (currentUser) {
            const fetchConversations = async () => {
                const conversationsQuery = query(
                    collection(db, 'pmessages'),
                    where('participants', 'array-contains', currentUser.id),
                    orderBy('timestamp', 'desc')
                );

                const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
                    const conversationsMap = new Map<string, Conversation>();

                    snapshot.docs.forEach((doc) => {
                        const message = doc.data() as Message;
                        const otherUserId = message.participants.find(id => id !== currentUser.id) || '';

                        if (!conversationsMap.has(otherUserId)) {
                            conversationsMap.set(otherUserId, {
                                userId: otherUserId,
                                lastMessage: message,
                                unreadCount: message.read ? 0 : 1
                            });
                        } else {
                            const conversation = conversationsMap.get(otherUserId)!;
                            if (!message.read) {
                                conversation.unreadCount++;
                            }
                        }
                    });

                    setConversations(Array.from(conversationsMap.values()));
                });

                return unsubscribe;
            };

            const unsubscribe = fetchConversations();
            return () => {
                unsubscribe.then(unsub => unsub());
            };
        }
    }, [currentUser]);

    useEffect(() => {
        if (selectedUser && currentUser) {
            const participants = [currentUser.id, selectedUser.id].sort();
            const conversationId = participants.join('_');

            const fetchMessages = async () => {
                try {
                    const messagesQuery = query(
                        collection(db, 'pmessages'),
                        where('conversationId', '==', conversationId),
                        orderBy('timestamp', 'asc')
                    );

                    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
                        const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
                        setMessages(messagesData);

                        // Mark messages as read
                        messagesData.forEach(async (message) => {
                            if (message.receiver === currentUser.id && !message.read) {
                                await updateMessageReadStatus(message.id);
                            }
                        });
                    });

                    return unsubscribe;
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            };

            const unsubscribe = fetchMessages();
            return () => {
                unsubscribe.then(unsub => unsub && unsub());
            };
        }
    }, [selectedUser, currentUser]);

    const updateMessageReadStatus = async (messageId: string) => {
        try {
            const messageRef = doc(db, 'pmessages', messageId);
            await updateDoc(messageRef, { read: true });
        } catch (error) {
            console.error("Error updating message read status:", error);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !currentUser || !currentMessage.trim()) return;

        const participants = [currentUser.id, selectedUser.id].sort();
        const conversationId = participants.join('_');

        const newMessage: Omit<Message, 'id'> = {
            text: currentMessage,
            sender: currentUser.id,
            receiver: selectedUser.id,
            timestamp: Timestamp.now(), // Use client-side timestamp for immediate display
            participants: participants,
            conversationId: conversationId,
            read: false,
        };

        try {
            // Optimistically update the UI
            setMessages(prevMessages => [...prevMessages, { ...newMessage, id: 'temp-' + Date.now() }]);
            setCurrentMessage('');

            // Add the message to Firestore
            const docRef = await addDoc(collection(db, 'pmessages'), {
                ...newMessage,
                timestamp: serverTimestamp(), // Use server timestamp for the database
            });

            // Update the temporary message with the real ID
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === 'temp-' + Date.now() ? { ...msg, id: docRef.id } : msg
                )
            );
        } catch (error) {
            console.error("Error sending message: ", error);
            alert("Failed to send message. Please try again.");
            // Remove the optimistically added message if there was an error
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== 'temp-' + Date.now()));
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const searchFiltered = filteredUsers.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.role.toLowerCase().includes(term)
        );
        setFilteredUsers(searchFiltered);
    };

    const renderMessage = (message: Message) => {
        const isCurrentUser = message.sender === currentUser?.id;
        return (
            <div key={message.id} className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`max-w-[70%] p-3 rounded-lg ${isCurrentUser
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                        }`}
                >
                    <p>{message.text}</p>
                    <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp instanceof Timestamp
                            ? message.timestamp.toDate().toLocaleTimeString()
                            : new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>
        );
    };

    const renderSidebarContent = () => {
        if (conversations.length > 0) {
            return conversations.map(conversation => {
                const user = users.find(u => u.id === conversation.userId);
                if (!user) return null;
                return (
                    <div
                        key={user.id}
                        className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition ${selectedUser?.id === user.id ? 'bg-blue-100' : ''}`}
                        onClick={() => setSelectedUser(user)}
                    >
                        <img src={user.photoURL || '/img/profile.jpg'} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                        <div className="flex-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-500">{conversation.lastMessage.text}</p>
                        </div>
                        {conversation.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-1">
                                {conversation.unreadCount}
                            </span>
                        )}
                    </div>
                );
            });
        } else {
            return filteredUsers.map(user => (
                <div
                    key={user.id}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition ${selectedUser?.id === user.id ? 'bg-blue-100' : ''}`}
                    onClick={() => setSelectedUser(user)}
                >
                    <img src={user.photoURL || '/img/profile.jpg'} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                </div>
            ));
        }
    };

    return (
        <NavLayout>
            <div className="flex h-screen bg-gray-100">
                <div className={`fixed z-40 inset-0 bg-black bg-opacity-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
                <div className={`fixed z-50 inset-y-0 left-0 w-64 bg-white transition-transform transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 border-b flex items-center justify-between lg:hidden">
                        <h2 className="text-xl font-bold">Users</h2>
                        <button onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                    </div>
                    <div className="p-4 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full p-2 pr-10 border rounded bg-gray-100"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>
                    <div className="overflow-y-auto h-[calc(100vh-80px)]">
                        {renderSidebarContent()}
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="bg-white p-4 border-b flex items-center justify-between">
                        {selectedUser && (
                            <div className="flex items-center space-x-3">
                                <img src={selectedUser.photoURL || '/img/profile.jpg'} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <h3 className="font-semibold">{selectedUser.name}</h3>
                                    <p className="text-sm text-gray-500">{selectedUser.role}</p>
                                </div>
                            </div>
                        )}
                        <button className="lg:hidden" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="p-4 bg-white border-t flex items-center">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            className="flex-1 p-2 border rounded bg-gray-100"
                        />
                        <button type="submit" className="ml-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </NavLayout>
    );
};

export default Message;