import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

export function useNotifications(currentUser) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Notification Preferences State
  const [settings, setSettings] = useState({
    deployment: true,
    domain: true,
    github: true,
    email: true,
  });

  // Load notifications based on the current user's role
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    notificationService.getNotifications(currentUser).then((data) => {
      if (isMounted) {
        setNotifications(data);
        
        // Simulate a small network delay for the skeleton
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, 400);
      }
    }).catch((err) => {
      console.error('Failed to fetch notifications:', err);
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  return {
    notifications,
    setNotifications,
    isLoading,
    setIsLoading,
    settings,
    setSettings,
  };
}
