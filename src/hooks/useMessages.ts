import { useState } from "react";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const useMessages = () => {
  const [messages, setMessages] = useState<any[] | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);

  const addMessage = async (data: object) => {
    setLoadingMessage(true);
    try {
      const submittedDoc = await addDoc(collection(db, "receiveMess"), data);
      await addDoc(collection(db, "sendMess"), data);
      console.log("Upload successful");
      setMessages((prevMessages) => [
        ...(prevMessages || []),
        { id: submittedDoc.id, ...data },
      ]);
    } catch (error) {
      console.log("error", error);
    }
    setLoadingMessage(false);
  };

  const fetchMessageReceivedUser = async (email: string) => {
    setLoadingMessage(true);
    try {
      const messagesRef = collection(db, "receiveMess");
      const receivedMessagesQuery = query(
        messagesRef,
        where("receiverId", "==", email),
        orderBy("time", "desc")
      );
      const receivedMessagesSnap = await getDocs(receivedMessagesQuery);
      const receivedMessages = receivedMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];
      setMessages(receivedMessages);
    } catch (error) {
      console.log("error", error);
    }
    setLoadingMessage(false);
  };

  const fetchMessageSentUser = async (email: string) => {
    setLoadingMessage(true);
    try {
      const messagesRef = collection(db, "sendMess");
      const sentMessagesQuery = query(
        messagesRef,
        where("sender", "==", email),
        orderBy("time", "desc")
      );
      const sentMessagesSnap = await getDocs(sentMessagesQuery);
      const sentMessages = sentMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];
      setMessages(sentMessages);
    } catch (error) {
      console.log("error", error);
    }
    setLoadingMessage(false);
  };

  const fetchMessageReceivedAdmin = async () => {
    setLoadingMessage(true);
    try {
      const messagesRef = collection(db, "receiveMess");
      const receivedMessagesQuery = query(
        messagesRef,
        where("receiverId", "in", ["admin", "staff"]),
        orderBy("time", "desc")
      );
      const receivedMessagesSnap = await getDocs(receivedMessagesQuery);
      const receivedMessages = receivedMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];
      setMessages(receivedMessages);
    } catch (error) {
      console.log("error", error);
    }
    setLoadingMessage(false);
  };

  const fetchMessageSentAdmin = async () => {
    setLoadingMessage(true);
    try {
      const messagesRef = collection(db, "sendMess");
      const sentMessagesQuery = query(
        messagesRef,
        where("sender", "in", ["admin", "staff"]),
        orderBy("time", "desc")
      );
      const sentMessagesSnap = await getDocs(sentMessagesQuery);
      const sentMessages = sentMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];
      setMessages(sentMessages);
    } catch (error) {
      console.log("error", error);
    }
    setLoadingMessage(false);
  };

  const updateMessageReadStatus = async (messageId: string) => {
    try {
      const messageRef = doc(db, "receiveMess", messageId);
      await updateDoc(messageRef, { read: true });

      setMessages((prevMessages) =>
        prevMessages?.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        ) || null
      );
    } catch (error) {
      console.error("Error updating message read status:", error);
    }
  };

  // Function to delete a message
  const deleteMessage = async (messageId: string) => {
    try {
      const messageRef = doc(db, "receiveMess", messageId);
      await deleteDoc(messageRef);
      setMessages((prevMessages) =>
        prevMessages?.filter((msg) => msg.id !== messageId) || null
      );
      console.log(`Message deleted from receiveMess`);
    } catch (error) {
      console.error(`Error deleting message from receiveMess:`, error);
    }
  };

  return {
    messages,
    loadingMessage,
    addMessage,
    fetchMessageReceivedUser,
    fetchMessageSentUser,
    fetchMessageReceivedAdmin,
    fetchMessageSentAdmin,
    updateMessageReadStatus,
    deleteMessage, // Expose the delete function
  };
};