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
            await addDoc(collection(db, 'pmessages'), {
                text: currentMessage,
                sender: currentUser.id,
                receiver: selectedUser.id,
                timestamp: serverTimestamp(),
                participants: participants,
                conversationId: conversationId,
                read: false
            });

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
                <div className="flex flex-row items-center p-4 border-b border-gray-300">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-700 ml-4">Messages</h2>

                    {/* Menu Icon for Mobile */}
                    <button onClick={toggleSidebar} className="ml-auto md:hidden text-gray-500 hover:text-gray-700">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <aside
                        className={`md:flex ${isSidebarOpen ? 'block' : 'hidden'} md:w-1/4 w-full flex-col bg-gray-100 border-r border-gray-300`}
                    >
                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute top-2 left-2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>

                            <ul className="space-y-2">
                                {filteredUsers.map(user => (
                                    <li
                                        key={user.id}
                                        className={`p-2 flex items-center justify-between cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <div className="flex items-center">
                                            <img src={user.photoURL || '/img/profile.jpg'} alt={user.name} className="h-8 w-8 rounded-full mr-3" />
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                        {user.unreadCount > 0 && (
                                            <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-semibold">
                                                {user.unreadCount}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Chat area */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 p-4 overflow-y-auto">
                            {messages.map(renderMessage)}
                            <div ref={messagesEndRef}></div>
                        </div>

                        {/* Message input */}
                        {selectedUser && (
                            <form onSubmit={sendMessage} className="flex p-4 border-t border-gray-300">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Type a message"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="ml-2 p-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <Send className="h-6 w-6" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
