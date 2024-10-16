import React, { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, orderBy, where, addDoc, serverTimestamp, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase';
import { Search, Send, Menu, X } from 'lucide-react';

interface User {
    id: string;
    name: string;
    role: string;
    photoURL: string;
    unreadCount: number;
    lastMessageTimestamp: any;
}

interface Message {
    id: string;
    text: string;
    sender: string;
    receiver: string;
    timestamp: any;
    participants: string[];
    conversationId: string;
    read: boolean;
}

const Message: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
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
                            unreadCount: 0,
                            lastMessageTimestamp: null,
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
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                unreadCount: doc.data().unreadCount || 0,
                lastMessageTimestamp: doc.data().lastMessageTimestamp || null,
            } as User));
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

        // Sort users by unread count (descending) and then by last message timestamp (descending)
        filtered.sort((a, b) => {
            if (b.unreadCount !== a.unreadCount) {
                return b.unreadCount - a.unreadCount;
            }
            return b.lastMessageTimestamp - a.lastMessageTimestamp;
        });

        setFilteredUsers(filtered);
    };

    useEffect(() => {
        filterUsers(users, currentUser);
    }, [currentUser, users]);

    useEffect(() => {
        if (selectedUser && currentUser) {
            const participants = [currentUser.id, selectedUser.id].sort();
            const conversationId = participants.join('_');

            const fetchMessages = async () => {
                try {
                    const messagesQuery = query(
                        collection(db, 'pmessages'),
                        where('conversationId', '==', conversationId)
                    );

                    const querySnapshot = await getDocs(messagesQuery);
                    const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));

                    messagesData.sort((a, b) => a.timestamp - b.timestamp);

                    setMessages(messagesData);

                    // Reset unread count for the selected user
                    await updateDoc(doc(db, 'users', currentUser.id), {
                        [`unreadCounts.${selectedUser.id}`]: 0
                    });
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            };

            fetchMessages();

            const markMessagesAsRead = async () => {
                const participants = [currentUser.id, selectedUser.id].sort();
                const conversationId = participants.join('_');
                const messagesQuery = query(
                    collection(db, 'pmessages'),
                    where('conversationId', '==', conversationId),
                    where('receiver', '==', currentUser.id),
                    where('read', '==', false)
                );

                const unreadMessages = await getDocs(messagesQuery);
                unreadMessages.forEach(async (doc) => {
                    await updateDoc(doc.ref, { read: true });
                });

                // Reset unread count for the selected user
                await updateDoc(doc(db, 'users', currentUser.id), {
                    [`unreadCounts.${selectedUser.id}`]: 0
                });
            };

            markMessagesAsRead();

            const unsubscribeMessages = onSnapshot(
                query(collection(db, 'pmessages'), where('conversationId', '==', conversationId)),
                (snapshot) => {
                    fetchMessages();
                }
            );


            return () => unsubscribeMessages();
        }
    }, [selectedUser, currentUser]);

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

        try {
            const messageDoc = await addDoc(collection(db, 'pmessages'), {
                text: currentMessage,
                sender: currentUser.id,
                receiver: selectedUser.id,
                timestamp: serverTimestamp(),
                participants: participants,
                conversationId: conversationId,
                read: false  // Add this line to set the initial read status
            });

            // Update last message timestamp and increment unread count for the receiver
            await updateDoc(doc(db, 'users', selectedUser.id), {
                lastMessageTimestamp: serverTimestamp(),
                [`unreadCounts.${currentUser.id}`]: (selectedUser.unreadCount || 0) + 1
            });

            setCurrentMessage('');
        } catch (error) {
            console.error("Error sending message: ", error);
            alert("Failed to send message. Please try again.");
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const searchFiltered = users.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.role.toLowerCase().includes(term)
        );
        filterUsers(searchFiltered, currentUser);
    };

    const renderMessage = (message: Message) => {
        const isCurrentUser = message.sender === currentUser?.id;
        return (
            <div key={message.id} className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`max-w-[70%] p-3 rounded-lg ${isCurrentUser
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : message.read
                                ? 'bg-white text-gray-800 rounded-bl-none shadow-md'
                                : 'bg-yellow-100 text-gray-800 rounded-bl-none shadow-md'
                        }`}
                >
                    <p>{message.text}</p>
                    <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp?.toDate().toLocaleTimeString()}
                    </span>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full h-full md:w-3/4 md:h-3/4 lg:w-2/3 lg:h-2/3 rounded-lg flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Messages</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    {/* User list */}
                    <div className="w-1/3 border-r overflow-y-auto">
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
                        {filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition ${selectedUser?.id === user.id ? 'bg-blue-100' : ''} ${user.unreadCount > 0 ? 'bg-yellow-50' : ''}`}
                                onClick={() => setSelectedUser(user)}
                            >
                                <img src={user.photoURL || '/img/profile.jpg'} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{user.name}</h3>
                                    <p className="text-sm text-gray-500">{user.role}</p>
                                </div>
                                {user.unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                                        {user.unreadCount}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Chat area */}
                    <div className="flex-1 flex flex-col">
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
            </div>
        </div>
    );
};

export default Message;