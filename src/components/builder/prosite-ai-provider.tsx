'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

export type Device = 'desktop' | 'tablet' | 'mobile';

export type Builder = 'website' | 'app' | 'dashboard' | 'chatbot' | 'agent' | 'game' | 'pricing' | 'image' | 'chat';

export interface Project {
  id: string;
  name: string;
  code: string;
  timestamp: Date;
}

interface ProSiteAIContextType {
  skeletonCode: string | null;
  setSkeletonCode: (code: string | null) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  device: Device;
  setDevice: (device: Device) => void;
  showLeftSidebar: boolean;
  setShowLeftSidebar: (show: boolean) => void;
  showRightSidebar: boolean;
  setShowRightSidebar: (show: boolean) => void;
  savedProjects: Project[];
  saveProject: (code: string) => { project: Project | null, error: string | null };
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  activeProject: Project | null;
  activeBuilder: Builder;
  setActiveBuilder: (builder: Builder) => void;
  totalTokens: number;
  addTokens: (amount: number) => void;
  isProUser: boolean; // Placeholder for pro status
  setIsProUser: (isPro: boolean) => void;
}

const ProSiteAIContext = createContext<ProSiteAIContextType | undefined>(undefined);

export const ProSiteAIProvider = ({ children }: { children: ReactNode }) => {
  const [skeletonCode, setSkeletonCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [device, setDevice] = useState<Device>('desktop');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeBuilder, setActiveBuilder] = useState<Builder>('website');
  const [totalTokens, setTotalTokens] = useState(0);
  const [isProUser, setIsProUser] = useState(false); // Default to free user

  const addTokens = useCallback((amount: number) => {
    setTotalTokens(prev => prev + amount);
  }, []);

  const saveProject = (code: string) => {
    if (!isProUser && savedProjects.length >= 2) {
      return { project: null, error: 'Free plan allows only 2 saved projects. Please upgrade to Pro.' };
    }
    
    const projectName = `Project ${savedProjects.length + 1}`;
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
      code,
      timestamp: new Date(),
    };
    setSavedProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
    return { project: newProject, error: null };
  };

  const loadProject = (id: string) => {
    const project = savedProjects.find(p => p.id === id);
    if (project) {
      setSkeletonCode(project.code);
      setActiveProject(project);
      // Switch to website builder when a project is loaded
      setActiveBuilder('website');
    }
  };

  const deleteProject = (id: string) => {
    if (activeProject?.id === id) {
      setActiveProject(null);
      setSkeletonCode(null);
    }
    setSavedProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProSiteAIContext.Provider
      value={{
        skeletonCode,
        setSkeletonCode,
        isGenerating,
        setIsGenerating,
        device,
        setDevice,
        showLeftSidebar,
        setShowLeftSidebar,
        showRightSidebar,
        setShowRightSidebar,
        savedProjects,
        saveProject,
        loadProject,
        deleteProject,
        activeProject,
        activeBuilder,
        setActiveBuilder,
        totalTokens,
        addTokens,
        isProUser,
        setIsProUser
      }}
    >
      {children}
    </ProSiteAIContext.Provider>
  );
};

export const useProSiteAI = () => {
  const context = useContext(ProSiteAIContext);
  if (context === undefined) {
    throw new Error('useProSiteAI must be used within a ProSiteAIProvider');
  }
  return context;
};
