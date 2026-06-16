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
  portfolioData as defaultPortfolioData,
  trackingConfig as defaultTrackingConfig,
  PortfolioItem,
} from '../data';

const STORAGE_KEY = 'cedevium-admin-data';
const PASSWORD_KEY = 'cedevium-admin-password';
const DEFAULT_PASSWORD = 'nemmone8338';

export const getAdminPassword = (): string =>
  localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;

export const setAdminPassword = (password: string): void =>
  localStorage.setItem(PASSWORD_KEY, password);

// ── Types ──────────────────────────────────────────────────────────────────
export type HeroData = typeof defaultHeroData;
export type ServicesData = typeof defaultServicesData;
export type ActivitiesData = typeof defaultActivitiesData;
export type GamesData = typeof defaultGamesData;
export type ContactData = typeof defaultContactData;
export type HeaderData = typeof defaultHeaderData;
export type FooterData = typeof defaultFooterData;
export type ImagesData = typeof defaultImages;
export type PortfolioData = typeof defaultPortfolioData;
export type TrackingConfig = typeof defaultTrackingConfig;
export type { PortfolioItem };

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

export interface EmailConfig {
  enabled: boolean;
  serviceId: string;
  templateId: string;
  confirmationTemplateId: string;
  publicKey: string;
  recipientEmail: string;
}

export interface LogoConfig {
  type: 'text' | 'image';
  imageData: string;
  imageAlt: string;
}

// ── Default values ──────────────────────────────────────────────────────────

const defaultPortfolioConfig: PortfolioData = defaultPortfolioData;
const defaultTracking: TrackingConfig = defaultTrackingConfig;

const defaultEmailConfig: EmailConfig = {
  enabled: false,
  serviceId: '',
  templateId: '',
  confirmationTemplateId: '',
  publicKey: '',
  recipientEmail: '',
};

const defaultLogoConfig: LogoConfig = {
  type: 'text',
  imageData: '',
  imageAlt: 'Cedevium Services',
};

interface AdminState {
  heroData: HeroData;
  servicesData: ServicesData;
  activitiesData: ActivitiesData;
  gamesData: GamesData;
  contactData: ContactData;
  headerData: HeaderData;
  footerData: FooterData;
  images: ImagesData;
  customPages: CustomPage[];
  emailConfig: EmailConfig;
  logoConfig: LogoConfig;
  portfolioData: PortfolioData;
  trackingConfig: TrackingConfig;
}

interface AdminDataContextType extends AdminState {
  isAdminOpen: boolean;
  isAuthenticated: boolean;
  prefilledSubject: string;
  openAdmin: () => void;
  closeAdmin: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (currentPwd: string, newPwd: string) => boolean;
  updateHeroData: (data: HeroData) => void;
  updateServicesData: (data: ServicesData) => void;
  updateActivitiesData: (data: ActivitiesData) => void;
  updateGamesData: (data: GamesData) => void;
  updateContactData: (data: ContactData) => void;
  updateHeaderData: (data: HeaderData) => void;
  updateFooterData: (data: FooterData) => void;
  updateImages: (data: ImagesData) => void;
  updateEmailConfig: (config: EmailConfig) => void;
  updateLogoConfig: (config: LogoConfig) => void;
  updatePortfolioData: (data: PortfolioData) => void;
  updateTrackingConfig: (config: TrackingConfig) => void;
  setPrefilledSubject: (subject: string) => void;
  addPage: (page: Omit<CustomPage, 'id' | 'createdAt'>) => void;
  updatePage: (id: string, page: Partial<CustomPage>) => void;
  deletePage: (id: string) => void;
  resetToDefaults: () => void;
}

// ── Default state ───────────────────────────────────────────────────────────
const defaultAdminState: AdminState = {
  heroData: defaultHeroData,
  servicesData: defaultServicesData,
  activitiesData: defaultActivitiesData,
  gamesData: defaultGamesData,
  contactData: defaultContactData,
  headerData: defaultHeaderData,
  footerData: defaultFooterData,
  images: defaultImages,
  customPages: [],
  emailConfig: defaultEmailConfig,
  logoConfig: defaultLogoConfig,
  portfolioData: defaultPortfolioConfig,
  trackingConfig: defaultTracking,
};

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function migrateActivities(stored: any) {
  if (!stored?.activitiesData?.activities) return stored?.activitiesData;
  return {
    ...defaultActivitiesData,
    ...stored.activitiesData,
    activities: stored.activitiesData.activities.map((a: any) => ({
      image: '',
      contactSubject: 'autre',
      ...a,
    })),
  };
}

function loadFromStorage(): AdminState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...deepClone(defaultAdminState),
        ...parsed,
        activitiesData: migrateActivities(parsed) || deepClone(defaultActivitiesData),
        emailConfig: { ...defaultEmailConfig, ...(parsed.emailConfig || {}) },
        logoConfig: { ...defaultLogoConfig, ...(parsed.logoConfig || {}) },
        portfolioData: { ...defaultPortfolioConfig, ...(parsed.portfolioData || {}) },
        trackingConfig: { ...defaultTracking, ...(parsed.trackingConfig || {}) },
      };
    }
  } catch {}
  return deepClone(defaultAdminState);
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

// ── Provider ────────────────────────────────────────────────────────────────
export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminState>(loadFromStorage);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('cedevium-admin-auth') === 'true'
  );
  const [prefilledSubject, setPrefilledSubject] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
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
    if (password === getAdminPassword()) {
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

  const changePassword = (currentPwd: string, newPwd: string): boolean => {
    if (currentPwd !== getAdminPassword()) return false;
    setAdminPassword(newPwd);
    return true;
  };

  const addPage = (page: Omit<CustomPage, 'id' | 'createdAt'>) => {
    const newPage: CustomPage = {
      ...page,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({ ...prev, customPages: [...prev.customPages, newPage] }));
  };

  const updatePage = (id: string, updates: Partial<CustomPage>) => {
    setData(prev => ({
      ...prev,
      customPages: prev.customPages.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  };

  const deletePage = (id: string) => {
    setData(prev => ({ ...prev, customPages: prev.customPages.filter(p => p.id !== id) }));
  };

  return (
    <AdminDataContext.Provider value={{
      ...data,
      isAdminOpen,
      isAuthenticated,
      prefilledSubject,
      openAdmin: () => setIsAdminOpen(true),
      closeAdmin: () => setIsAdminOpen(false),
      login,
      logout,
      changePassword,
      updateHeroData: (v) => update('heroData', v),
      updateServicesData: (v) => update('servicesData', v),
      updateActivitiesData: (v) => update('activitiesData', v),
      updateGamesData: (v) => update('gamesData', v),
      updateContactData: (v) => update('contactData', v),
      updateHeaderData: (v) => update('headerData', v),
      updateFooterData: (v) => update('footerData', v),
      updateImages: (v) => update('images', v),
      updateEmailConfig: (v) => update('emailConfig', v),
      updateLogoConfig: (v) => update('logoConfig', v),
      updatePortfolioData: (v) => update('portfolioData', v),
      updateTrackingConfig: (v) => update('trackingConfig', v),
      setPrefilledSubject,
      addPage,
      updatePage,
      deletePage,
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
