"use client";
import React, { useCallback, useState } from "react";

interface NotificationProviderProps {
  children: React.ReactNode;
}

export type NotificationType = {
  message: string;
  timestamp: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export type NotificationContextType = {
  notifications: Array<NotificationType>;
  postNotification: (notification: NotificationType) => void;
  deleteNotification: (timestamp: number) => void;
};

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationContext = React.createContext<NotificationContextType>(
  {
    notifications: [],
    postNotification: () => {},
    deleteNotification: () => {},
  }
);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Array<NotificationType>>(
    []
  );
  const postNotification = useCallback((notification: NotificationType) => {
    setNotifications((notifications) => [notification, ...notifications]);
  }, []);

  const deleteNotification = useCallback((timestamp: number) => {
    setNotifications((notifications) =>
      notifications.filter(
        (notification) => notification.timestamp !== timestamp
      )
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, postNotification, deleteNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
