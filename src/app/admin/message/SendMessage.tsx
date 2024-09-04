import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { currentTime } from '@/helper/time';

interface SendMessageModalProps {
  onClose: () => void;
}

const SendMessage: React.FC<SendMessageModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!email.trim() || !message.trim()) {
      alert('Please fill in both the email and message.');
      return;
    }

    try {
      // Query Firestore to get the user by email
      const userSnap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));

      if (userSnap.docs.length > 0) {
        const user = userSnap.docs[0];
        const userId = user.id; // Get the user ID from the document ID
        const userName = user.data().name;

        await addDoc(collection(db, 'messages'), {
          message: message.trim(),
          read: false,
          sender: "admin", // Assuming "admin" is the sender
          senderName: "Admin", // Assuming "admin" is the sender
          time: currentTime,
          receiverId: userId, // Use the user ID as receiverId
          receiverName: userName // Optionally store the user's name
        });

        alert('Message sent successfully.');
        setEmail('');
        setMessage('');
        onClose(); // Close the modal after sending the message
      } else {
        alert('Email not found in users collection.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/6">
        <h2 className="text-lg font-bold mb-4 text-primary drop-shadow">Send Message</h2>
        <input
          type="text"
          name="email"
          placeholder="User's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          cols={30}
          rows={10}
          className="w-full p-2 mb-4 border rounded resize-none text-sm"
        />
        <div className="flex justify-end space-x-5">
          <button onClick={onClose} className="text-neutral btn btn-outline rounded-sm">
            Cancel
          </button>
          <button onClick={sendMessage} className="text-white btn btn-primary rounded-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
