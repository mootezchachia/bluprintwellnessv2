"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CircleStateContextType {
  state: number;
  setState: (newState: number) => void;
}

const CircleStateContext = createContext<CircleStateContextType>({
  state: 0,
  setState: () => {},
});

export function useCircleState() {
  return useContext(CircleStateContext);
}

export function CircleStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(0);
  return (
    <CircleStateContext.Provider value={{ state, setState }}>
      {children}
    </CircleStateContext.Provider>
  );
}
