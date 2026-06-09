import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  heroData as defaultHeroData,
  servicesData as defaultServicesData,
  activitiesData as defaultActivitiesData,
  gamesData as defaultGamesData,
  contactData as defaultContactData,
  headerData as defaultHeaderData,
  footerData as defaultFooterData,
  images as defaultImages,
} from '../data';

const STORAGE_KEY = 'cedevium-admin-data';
export const ADMIN_PASSWORD = 'nemmone8338';

export type HeroData = typeof defaultHeroData;
export type ServicesData = typeof defaultServicesData;
export type ActivitiesData = typeof defaultActivitiesData;
export type GamesData = typeof defaultGamesData;
export type ContactData = typeof defaultContactData;
export type HeaderData = typeof defaultHeaderData;
export type FooterData = typeof defaultFooterData;
export type ImagesData = typeof defaultImages;

interface AdminState {
  heroData: HeroData;
  servicesData: ServicesData;
  activitiesData: ActivitiesData;
  gamesData: GamesData;
  contactData: ContactData;
  headerData: HeaderData;
  footerData: FooterData;
  images: ImagesData;
}

interface AdminDataContextType extends AdminState {
  isAdminOpen: boolean;
  isAuthenticated: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  updateHeroData: (data: HeroData) => void;
  updateServicesData: (data: ServicesData) => void;
  updateActivitiesData: (data: ActivitiesData) => void;
  updateGamesData: (data: GamesData) => void;
  updateContactData: (data: ContactData) => void;
  updateHeaderData: (data: HeaderData) => void;
  updateFooterData: (data: FooterData) => void;
  updateImages: (data: ImagesData) => void;
  resetToDefaults: () => void;
}

const defaultAdminState: AdminState = {
  heroData: defaultHeroData,
  servicesData: defaultServicesData,
  activitiesData: defaultActivitiesData,
  gamesData: defaultGamesData,
  contactData: defaultContactData,
  headerData: defaultHeaderData,
  footerData: defaultFooterData,
  images: defaultImages,
};

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function loadFromStorage(): AdminState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultAdminState, ...parsed };
    }
  } catch {}
  return deepClone(defaultAdminState);
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminState>(loadFromStorage);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('cedevium-admin-auth') === 'true'
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function update<K extends keyof AdminState>(key: K, value: AdminState[K]) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('cedevium-admin-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cedevium-admin-auth');
    setIsAdminOpen(false);
  };

  return (
    <AdminDataContext.Provider value={{
      ...data,
      isAdminOpen,
      isAuthenticated,
      openAdmin: () => setIsAdminOpen(true),
      closeAdmin: () => setIsAdminOpen(false),
      login,
      logout,
      updateHeroData: (v) => update('heroData', v),
      updateServicesData: (v) => update('servicesData', v),
      updateActivitiesData: (v) => update('activitiesData', v),
      updateGamesData: (v) => update('gamesData', v),
      updateContactData: (v) => update('contactData', v),
      updateHeaderData: (v) => update('headerData', v),
      updateFooterData: (v) => update('footerData', v),
      updateImages: (v) => update('images', v),
      resetToDefaults: () => {
        setData(deepClone(defaultAdminState));
        localStorage.removeItem(STORAGE_KEY);
      },
    }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData(): AdminDataContextType {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
}
