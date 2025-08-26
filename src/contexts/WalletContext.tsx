'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WalletContextType {
  walletAddress: string | null;
  tokenBalance: string | null;
  setWalletAddress: (address: string | null) => void;
  setTokenBalance: (balance: string | null) => void;
  getNumericBalance: () => number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem('connectedWalletAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
  }, []);

  const getNumericBalance = (): number => {
    if (!tokenBalance) return 0;
    const parsed = parseFloat(tokenBalance);
    return isNaN(parsed) ? 0 : parsed;
  };

  const value: WalletContextType = {
    walletAddress,
    tokenBalance,
    setWalletAddress,
    setTokenBalance,
    getNumericBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};