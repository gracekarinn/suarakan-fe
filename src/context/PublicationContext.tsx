"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminPublication } from "@/modules/AdminPublicationModule/interface";
import { adminpublications as dummyData } from "@/modules/AdminPublicationModule/constant";

// 1. Context type
interface PublicationContextType {
  publications: AdminPublication[];
  setPublications: React.Dispatch<React.SetStateAction<AdminPublication[]>>;
  updatePublication: (updated: AdminPublication) => void;
  deletePublication: (id: number) => void;
  addPublication: (newPub: AdminPublication) => void;
}

// 2. Create context
const PublicationContext = createContext<PublicationContextType | undefined>(undefined);

// 3. Provider
export const PublicationProvider = ({ children }: { children: React.ReactNode }) => {
  const [publications, setPublications] = useState<AdminPublication[]>([]);

  useEffect(() => {
    setPublications(dummyData); // bisa diganti fetch nanti
  }, []);

  const updatePublication = (updated: AdminPublication) => {
    setPublications((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const deletePublication = (id: number) => {
    setPublications((prev) => prev.filter((p) => p.id !== id));
  };

  const addPublication = (newPub: AdminPublication) => {
    setPublications((prev) => [...prev, newPub]);
  };

  return (
    <PublicationContext.Provider
      value={{
        publications,
        setPublications,
        updatePublication,
        deletePublication,
        addPublication,
      }}
    >
      {children}
    </PublicationContext.Provider>
  );
};

// 4. Custom hook
export const usePublicationContext = () => {
  const context = useContext(PublicationContext);
  if (!context) {
    throw new Error("usePublicationContext must be used within a PublicationProvider");
  }
  return context;
};
