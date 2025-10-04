// src/contexts/VerificationContext.jsx
import React, { createContext, useState } from 'react';

export const VerificationContext = createContext();

export const VerificationProvider = ({ children }) => {
  const [recentVerifications, setRecentVerifications] = useState([]);

  // Function to add a new verification to the top of the list
  const addVerification = (newVerification) => {
    setRecentVerifications(prev => [newVerification, ...prev].slice(0, 5)); // Keep only the latest 5
  };

  return (
    <VerificationContext.Provider value={{ recentVerifications, addVerification }}>
      {children}
    </VerificationContext.Provider>
  );
};