"use client";
import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import UserNavLayout from "@/components/UserNavLayout";

interface Message {
  senderId: string;
  message: string;
  timestamp: any;
  isAdmin: boolean;
}

const Chat = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastSeenMessageTimestamp, setLastSeenMessageTimestamp] = useState<number | null>(null);

  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user || !user?.uid) return; // Ensure user.uid is defined

    const q = query(
      collection(db, "chats", user.uid, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        ...(doc.data() as unknown as Message), // Cast to unknown first
        id: doc.id,
      })) as Message[]; // Ensure doc.data() returns all Message properties

      setMessages(messages);

      // Automatically set the last seen timestamp to the latest message timestamp if there is a new message
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        setLastSeenMessageTimestamp(lastMessage.timestamp.seconds);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !user) return; // Check if user is defined

    await addDoc(collection(db, "chats", user.uid, "messages"), {
      senderId: user.uid!,
      message: newMessage,
      timestamp: serverTimestamp(),
      isAdmin: false, // Update this based on whether it's a user or admin
    });

    setNewMessage("");
  };

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <UserNavLayout>
      <div className="chat-container">
        <div className="messages-list h-80 overflow-y-auto p-4 bg-gray-100 rounded-lg" ref={messageListRef}>
          {messages.map((msg, index) => {
            // Check if the message is newer than the last seen message timestamp
            const isNewMessage =
              lastSeenMessageTimestamp !== null && msg.timestamp?.seconds > lastSeenMessageTimestamp;

            return (
              <div
                key={index}
                className={`message p-2 mb-2 rounded-lg ${
                  isNewMessage
                    ? "bg-red-400"
                    : msg.isAdmin
                    ? "bg-blue-200"
                    : "bg-green-200"
                }`}
              >
                <p>{msg.message}</p>
              </div>
            );
          })}
        </div>

        <div className="input-container mt-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg flex-grow"
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-lg ml-2">
            Send
          </button>
        </div>
      </div>
    </UserNavLayout>
  );
};

export default Chat;
