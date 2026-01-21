import React, { createContext, useContext, useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const showSuccess = useCallback((message) => {
    enqueueSnackbar(message, { variant: 'success', autoHideDuration: 3000 });
  }, []);

  const showError = useCallback((message) => {
    enqueueSnackbar(message, { variant: 'error', autoHideDuration: 5000 });
  }, []);

  const showWarning = useCallback((message) => {
    enqueueSnackbar(message, { variant: 'warning', autoHideDuration: 4000 });
  }, []);

  const showInfo = useCallback((message) => {
    enqueueSnackbar(message, { variant: 'info', autoHideDuration: 3000 });
  }, []);

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};