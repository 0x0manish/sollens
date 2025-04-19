"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// Create context
type GlobalLoadingContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

// Provider component - now just provides a consistent dark background
export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {/* Fixed background layer to prevent white flash during transitions */}
      <div className="fixed inset-0 bg-slate-900 -z-10" aria-hidden="true" />
      {children}
    </GlobalLoadingContext.Provider>
  );
}

// Hook for using the context (for potential future use)
export function useGlobalLoading() {
  return useContext(GlobalLoadingContext);
}
