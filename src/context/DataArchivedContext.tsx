"use client";

import { IArchivedSurah } from "@/components/RecentRead";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface DataContextProps {
  data: IArchivedSurah | undefined;
  setData: React.Dispatch<React.SetStateAction<IArchivedSurah | undefined>>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

// Create a provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<IArchivedSurah | undefined>();

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the DataContext
export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
