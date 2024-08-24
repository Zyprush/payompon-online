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
  sentMessages: Array<any> | null;
  receivedMessages: Array<any> | null;
  loadingMessage: boolean;
  fetchMessageByUser: (userId: string) => Promise<void>;
  fetchMessageByAdmin: () => Promise<void>;
  addMessage: (data: object) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set) => ({
  sentMessages: null,
  receivedMessages: null,
  loadingMessage: false,

  addMessage: async (data: object) => {
    set({ loadingMessage: true });
    try {
      const submittedDoc = await addDoc(collection(db, "message"), data);
      console.log("Upload successful");
      set((state) => ({
        sentMessages: state.sentMessages
          ? [...state.sentMessages, { id: submittedDoc.id, ...data }]
          : [{ id: submittedDoc.id, ...data }],
        loadingMessage: false,
      }));
    } catch (error) {
      console.log("error", error);
    }
    set({ loadingMessage: false });
  },
  
  fetchMessageByUser: async (userId) => {
    set({ loadingMessage: true });
    try {
      const messagesRef = collection(db, "message");
  
      // Query for messages where the user is the sender
      const sentMessagesQuery = query(
        messagesRef,
        where("sender", "==", userId),
        orderBy("time", "desc")
      );
  
      // Query for messages where the user is the receiver
      const receivedMessagesQuery = query(
        messagesRef,
        where("receiver", "==", userId),
        orderBy("time", "desc")
      );
  
      // Execute both queries in parallel
      const [sentMessagesSnap, receivedMessagesSnap] = await Promise.all([
        getDocs(sentMessagesQuery),
        getDocs(receivedMessagesQuery),
      ]);
  
      // Map and set sent and received messages separately
      const sentMessages = sentMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const receivedMessages = receivedMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({
        sentMessages,
        receivedMessages,
        loadingMessage: false,
      });
    } catch (error: any) {
      console.log("error", error);
      set({ loadingMessage: false });
    }
  },
  
  fetchMessageByAdmin: async () => {
    set({ loadingMessage: true });
    try {
      const messagesRef = collection(db, "message");
  
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
        sentMessages,
        receivedMessages: null, // Clear or set receivedMessages as null if not needed
        loadingMessage: false,
      });
    } catch (error: any) {
      console.log("error", error);
      set({ loadingMessage: false });
    }
  },
}));
