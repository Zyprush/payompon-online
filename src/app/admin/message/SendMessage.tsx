import React, { useState } from 'react';
import { collection, doc, getDoc, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

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
      const userSnap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));

      if (userSnap.docs.length > 0) {
        const currentTime = serverTimestamp();
        await addDoc(collection(db, 'messages'), {
          message: message.trim(),
          read: false,
          sender: "admin",
          time: currentTime,
          receiver: email,
        //   reciverName: userSnap.docs.name
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
        <h2 className="text-lg font-bold mb-4">Send Message</h2>
        <input
          type="text"
          name="email"
          placeholder="Your email"
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
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex justify-end space-x-2">
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
