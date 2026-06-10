import { useState, useEffect } from 'react';

const ASSETS_KEY = 'cedevium-admin-assets';

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video';
  dataUrl: string; // base64 data URL or external URL
  size?: number;
  createdAt: string;
}

function loadAssets(): Asset[] {
  try {
    const stored = localStorage.getItem(ASSETS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAssets(assets: Asset[]) {
  try {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  } catch (e) {
    throw new Error('Stockage plein. Supprimez des assets pour en ajouter de nouveaux.');
  }
}

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>(loadAssets);

  useEffect(() => {
    saveAssets(assets);
  }, [assets]);

  const addAsset = (file: File): Promise<Asset> => {
    return new Promise((resolve, reject) => {
      if (file.size > 4 * 1024 * 1024) {
        reject(new Error('Fichier trop lourd (max 4 Mo). Compressez l\'image avant upload.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const asset: Asset = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type.startsWith('video') ? 'video' : 'image',
          dataUrl: reader.result as string,
          size: file.size,
          createdAt: new Date().toISOString(),
        };
        setAssets(prev => {
          const next = [...prev, asset];
          try {
            saveAssets(next);
            resolve(asset);
            return next;
          } catch (e: any) {
            reject(new Error(e.message));
            return prev;
          }
        });
      };
      reader.onerror = () => reject(new Error('Échec de la lecture du fichier.'));
      reader.readAsDataURL(file);
    });
  };

  const addAssetFromUrl = (url: string, name: string): Asset => {
    const asset: Asset = {
      id: Date.now().toString(),
      name: name || url.split('/').pop() || 'asset',
      type: /\.(mp4|webm|ogg|mov)$/i.test(url) ? 'video' : 'image',
      dataUrl: url,
      createdAt: new Date().toISOString(),
    };
    setAssets(prev => [...prev, asset]);
    return asset;
  };

  const removeAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  return { assets, addAsset, addAssetFromUrl, removeAsset };
}
