import React, { createContext, useContext, useState, useCallback } from "react";

export type View =
  | "home"
  | "sign-in"
  | "sign-up"
  | "consultation"
  | "health-analysis"
  | "profile"
  | "appointments"
  | "doctors"
  | "learn-more"
  | "terms"
  | "privacy";

interface AppContextType {
  currentView: View;
  setView: (view: View) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userType: "patient" | "doctor" | null;
  setUserType: (type: "patient" | "doctor" | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<View>("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"patient" | "doctor" | null>(null);

  const setView = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setView,
        isAuthenticated,
        setIsAuthenticated,
        userType,
        setUserType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
