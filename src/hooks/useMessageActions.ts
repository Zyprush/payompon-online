import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'; // Added missing imports
import { db } from '@/firebase';
import { currentTime } from '@/helper/time'; // Assuming currentTime is a function returning a timestamp

interface MessageData {
  message: string;
  receiverId: string;
  receiverName: string;
  senderId: string;
  senderName: string;
}

export const useSendMessage = () => {
  const sendMessage = async (messageData: MessageData) => {
    try {
      await addDoc(collection(db, 'messages'), {
        message: messageData.message.trim(),
        read: false,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        time: currentTime,
        receiverId: messageData.receiverId,
        receiverName: messageData.receiverName,
      });
    } catch (error) {
      throw new Error("Error sending message: " + (error as any).message);
    }
  };

  return sendMessage;
};

export const useFetchUserByEmail = () => {
  const fetchUserByEmail = async (email: string) => {
    try {
      const userSnap = await getDocs(
        query(collection(db, 'users'), where('email', '==', email)) // Added necessary imports for query and where
      );

      if (userSnap.docs.length > 0) {
        const user = userSnap.docs[0];
        return { id: user.id, ...user.data() };
      } else {
        return null; // Return null if no user found
      }
    } catch (error) {
      throw new Error('Error fetching user: ' + (error as any).message);
    }
  };

  return fetchUserByEmail;
};
