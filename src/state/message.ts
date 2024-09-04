import { create } from "zustand";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";


interface MessageStore {
  messages: Array<any> | null;
  loadingMessage: boolean;
  fetchMessageReceivedUser: (email: string) => Promise<void>;
  fetchMessageSentUser: (email: string) => Promise<void>;
  fetchMessageReceivedAdmin: () => Promise<void>;
  fetchMessageSentAdmin: () => Promise<void>;
  addMessage: (data: object) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: null,
  loadingMessage: false,

  addMessage: async (data: object) => {
    set({ loadingMessage: true });
    try {
      const submittedDoc = await addDoc(collection(db, "messages"), data);
      console.log("Upload successful");
      set((state) => ({
        messages: state.messages
          ? [...state.messages, { id: submittedDoc.id, ...data }]
          : [{ id: submittedDoc.id, ...data }],
        loadingMessage: false,
      }));
    } catch (error) {
      console.log("error", error);
    }
    set({ loadingMessage: false });
  },

  fetchMessageReceivedUser: async (email: string) => {
    set({ loadingMessage: true });
    try {
      const messagesRef = collection(db, "messages");
  
      // Query for messages where the user is the receiver
      const receivedMessagesQuery = query(
        messagesRef,
        where("receiver", "==", email),
        orderBy("time", "desc")
      );
  
      // Execute the query
      const receivedMessagesSnap = await getDocs(receivedMessagesQuery);
  
      // Map and set received messages
      const receivedMessages = receivedMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      set({
        messages: receivedMessages,
        loadingMessage: false,
      });
    } catch (error: any) {
      console.log("error", error);
      set({ loadingMessage: false });
    }
  },

  fetchMessageSentUser: async (email: string) => {
    set({ loadingMessage: true });
    try {
      const messagesRef = collection(db, "messages");
  
      // Query for messages where the user is the sender
      const sentMessagesQuery = query(
        messagesRef,
        where("sender", "==", email),
        orderBy("time", "desc")
      );
  
      // Execute the query
      const sentMessagesSnap = await getDocs(sentMessagesQuery);
  
      // Map and set sent messages
      const sentMessages = sentMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      set({
        messages: sentMessages,
        loadingMessage: false,
      });
    } catch (error: any) {
      console.log("error", error);
      set({ loadingMessage: false });
    }
  },

  fetchMessageReceivedAdmin: async () => {
    set({ loadingMessage: true });
    try {
      const messagesRef = collection(db, "messages");
  
      // Query for messages where the receiver is 'admin'
      const receivedMessagesQuery = query(
        messagesRef,
        where("receiver", "in", ["admin", "staff"]),
        orderBy("time", "desc")
      );
  
      // Execute the query
      const receivedMessagesSnap = await getDocs(receivedMessagesQuery);
  
      // Map and set received messages
      const receivedMessages = receivedMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      set({
        messages: receivedMessages,
        loadingMessage: false,
      });
    } catch (error: any) {
      console.log("error", error);
      set({ loadingMessage: false });
    }
  },

  fetchMessageSentAdmin: async () => {
    set({ loadingMessage: true });
    try {
      const messagesRef = collection(db, "messages");
  
      // Query for messages where the sender is 'admin' or 'staff'
      const sentMessagesQuery = query(
        messagesRef,
        where("sender", "in", ["admin", "staff"]),
        orderBy("time", "desc")
      );
  
      // Execute the query
      const sentMessagesSnap = await getDocs(sentMessagesQuery);
  
      // Map and set sent messages
      const sentMessages = sentMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      set({
        messages: sentMessages,
        loadingMessage: false,
      });
    } catch (error: any) {
      console.log("error", error);
      set({ loadingMessage: false });
    }
  },
}));
