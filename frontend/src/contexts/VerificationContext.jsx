// src/contexts/VerificationContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const VerificationContext = createContext();

export const VerificationProvider = ({ children }) => {
  const [verifications, setVerifications] = useState([]);

  // This function is called by AddressVerification.jsx
  const addVerification = (newVerification) => {
    // Adds the new result to the top of the list, keeping the last 5
    setVerifications(prev => [newVerification, ...prev].slice(0, 5));
  };
  
  // We can also load initial data here if we want
  useEffect(() => {
    // Optional: fetch initial recent verifications when the app loads
  }, []);

  return (
    <VerificationContext.Provider value={{ verifications, addVerification }}>
      {children}
    </VerificationContext.Provider>
  );
};