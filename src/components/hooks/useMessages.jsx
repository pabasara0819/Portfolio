// hooks/useMessages.js
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs, onSnapshot } from 'firebase/firestore';

export const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    // Real-time listener for messages
    const messagesRef = collection(db, 'ContactMessages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList = [];
      let unreadCount = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      snapshot.forEach((doc) => {
        const message = { id: doc.id, ...doc.data() };
        messagesList.push(message);
        
        // Count unread messages
        if (!message.read) unreadCount++;
      });

      // Calculate statistics
      const todayMessages = messagesList.filter(msg => {
        const msgDate = msg.timestamp?.toDate();
        return msgDate && msgDate >= today;
      });

      const weekMessages = messagesList.filter(msg => {
        const msgDate = msg.timestamp?.toDate();
        return msgDate && msgDate >= weekAgo;
      });

      const monthMessages = messagesList.filter(msg => {
        const msgDate = msg.timestamp?.toDate();
        return msgDate && msgDate >= monthAgo;
      });

      setMessages(messagesList);
      setStats({
        total: messagesList.length,
        unread: unreadCount,
        today: todayMessages.length,
        thisWeek: weekMessages.length,
        thisMonth: monthMessages.length
      });
      setRecentMessages(messagesList.slice(0, 5)); // Get 5 most recent messages
      setLoading(false);
    }, (error) => {
      console.error('Error fetching messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { messages, stats, recentMessages, loading };
};