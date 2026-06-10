import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, SectionCard, SaveButton } from '../AdminComponents';

const LogoSection: React.FC = () => {
  const { logoConfig, updateLogoConfig } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(logoConfig)));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Fichier trop lourd (max 2 Mo). Compressez votre logo.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setLocal((prev: typeof logoConfig) => ({
        ...prev,
        type: 'image',
        imageData: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const clearLogo = () => {
    setLocal((prev: typeof logoConfig) => ({ ...prev, type: 'text', imageData: '' }));
  };

  const handleSave = () => {
    updateLogoConfig(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-xl">
      <SectionCard title="Logo de l'entreprise">
        <div className="space-y-6">
          {/* Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Aperçu dans le header</p>
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#1E1A34' }}>
              {local.type === 'image' && local.imageData ? (
                <img src={local.imageData} alt={local.imageAlt} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl text-white" style={{ background: '#DC582A' }}>
                  CS
                </div>
              )}
              <span className="text-white font-bold text-xl">Cedevium Services</span>
            </div>
          </div>

          {/* Upload zone */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Logo (PNG, SVG, JPG — max 2 Mo)</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#DC582A] hover:bg-orange-50 transition-all"
            >
              {local.imageData ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={local.imageData} alt="Logo" className="h-16 object-contain mx-auto" />
                  <span className="text-xs text-gray-400">Cliquer pour remplacer</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Upload size={28} />
                  <span className="text-sm">Cliquer pour uploader votre logo</span>
                  <span className="text-xs">PNG, SVG, JPG recommandés · fond transparent conseillé</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* URL alternative */}
          <div>
            <FormField
              label="Ou entrez l'URL d'un logo externe"
              value={local.type === 'image' && !local.imageData.startsWith('data:') ? local.imageData : ''}
              onChange={(v) => setLocal((prev: typeof logoConfig) => ({ ...prev, type: 'image', imageData: v }))}
              placeholder="https://exemple.com/logo.png"
            />
          </div>

          <FormField
            label="Texte alternatif (accessibilité)"
            value={local.imageAlt}
            onChange={(v) => setLocal((prev: typeof logoConfig) => ({ ...prev, imageAlt: v }))}
            placeholder="Nom de l'entreprise"
          />

          {local.imageData && (
            <button type="button" onClick={clearLogo}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600">
              <X size={16} /> Supprimer le logo (revenir aux initiales)
            </button>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default LogoSection;
