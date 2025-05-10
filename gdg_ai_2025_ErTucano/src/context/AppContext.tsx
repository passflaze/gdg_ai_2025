import React, { createContext, useContext, useState } from 'react';
import { Subject, User, FlashcardDeck, Material } from '../types';
import { user, subjects, flashcardDecks } from '../data/mockData';

interface AppContextType {
  currentUser: User;
  subjects: Subject[];
  flashcardDecks: FlashcardDeck[];
  selectedSubject: Subject | null;
  selectedMaterial: Material | null;
  activeTab: string;
  setSelectedSubject: (subject: Subject | null) => void;
  setSelectedMaterial: (material: Material | null) => void;
  setActiveTab: (tab: string) => void;
}

const defaultContextValue: AppContextType = {
  currentUser: user,
  subjects: subjects,
  flashcardDecks: flashcardDecks,
  selectedSubject: null,
  selectedMaterial: null,
  activeTab: 'graph',
  setSelectedSubject: () => {},
  setSelectedMaterial: () => {},
  setActiveTab: () => {}
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [activeTab, setActiveTab] = useState('graph');

  const value = {
    currentUser: user,
    subjects,
    flashcardDecks,
    selectedSubject,
    selectedMaterial,
    activeTab,
    setSelectedSubject,
    setSelectedMaterial,
    setActiveTab
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};