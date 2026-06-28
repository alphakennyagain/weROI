"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import ResumeModal from "./ResumeModal";

interface ResumeContextValue {
  openResume: () => void;
}

const ResumeContext = createContext<ResumeContextValue>({ openResume: () => {} });

export function useResume() {
  return useContext(ResumeContext);
}

export default function ResumeProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openResume = useCallback(() => setOpen(true), []);

  return (
    <ResumeContext.Provider value={{ openResume }}>
      {children}
      <ResumeModal open={open} onClose={() => setOpen(false)} />
    </ResumeContext.Provider>
  );
}
