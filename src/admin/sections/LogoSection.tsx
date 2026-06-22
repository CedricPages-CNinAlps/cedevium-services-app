import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, SectionCard, SaveButton } from '../AdminComponents';
import { uploadImage } from '../../utils/uploadImage';

const LogoSection: React.FC = () => {
  const { logoConfig, updateLogoConfig } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(logoConfig)));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const touchIconRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError('');
    setUploading('logo');
    try {
      const url = await uploadImage(file);
      setLocal((prev: typeof logoConfig) => ({ ...prev, type: 'image', imageData: url }));
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'upload du logo.");
    } finally {
      setUploading(null);
    }
  };

  const clearLogo = () => {
    setLocal((prev: typeof logoConfig) => ({ ...prev, type: 'text', imageData: '' }));
  };

  const handleIconUpload = async (field: 'favicon' | 'appleTouchIcon', file: File) => {
    setError('');
    setUploading(field);
    try {
      const url = await uploadImage(file);
      setLocal((prev: typeof logoConfig) => ({ ...prev, [field]: url }));
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(null);
    }
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
              {uploading === 'logo' ? (
                <div className="flex flex-col items-center gap-2 text-[#DC582A]">
                  <Upload size={28} className="animate-bounce" />
                  <span className="text-sm">Upload en cours...</span>
                </div>
              ) : local.imageData ? (
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

      <SectionCard title="Favicon (onglet navigateur)">
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Icône affichée dans l'onglet du navigateur. Format recommandé : ICO ou PNG carré (32×32 ou 64×64 px).</p>
          <div className="flex items-center gap-4">
            {local.favicon ? (
              <div className="flex items-center gap-3">
                <img src={local.favicon} alt="favicon" className="w-8 h-8 object-contain border rounded" />
                <button type="button" onClick={() => setLocal((prev: typeof logoConfig) => ({ ...prev, favicon: '' }))}
                  className="p-1 text-red-400 hover:text-red-600"><X size={16} /></button>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-100 border rounded flex items-center justify-center text-gray-300 text-xs">?</div>
            )}
            <button type="button" onClick={() => faviconRef.current?.click()} disabled={!!uploading}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm transition-colors disabled:opacity-50">
              <Upload size={15} /> {uploading === 'favicon' ? 'Upload...' : 'Uploader'}
            </button>
            <input ref={faviconRef} type="file" accept="image/*,.ico" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleIconUpload('favicon', f); e.target.value = ''; }} />
          </div>
          <FormField label="Ou URL externe" value={local.favicon?.startsWith('data:') ? '' : (local.favicon || '')}
            onChange={(v) => setLocal((prev: typeof logoConfig) => ({ ...prev, favicon: v }))}
            placeholder="https://exemple.com/favicon.ico" />
        </div>
      </SectionCard>

      <SectionCard title="Icône mobile (ajout à l'écran d'accueil)">
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Icône affichée quand un utilisateur ajoute le site sur son smartphone ou tablette. Format recommandé : PNG carré (180×180 px).</p>
          <div className="flex items-center gap-4">
            {local.appleTouchIcon ? (
              <div className="flex items-center gap-3">
                <img src={local.appleTouchIcon} alt="touch icon" className="w-12 h-12 object-contain border rounded-xl" />
                <button type="button" onClick={() => setLocal((prev: typeof logoConfig) => ({ ...prev, appleTouchIcon: '' }))}
                  className="p-1 text-red-400 hover:text-red-600"><X size={16} /></button>
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-100 border rounded-xl flex items-center justify-center text-gray-300 text-xs">?</div>
            )}
            <button type="button" onClick={() => touchIconRef.current?.click()} disabled={!!uploading}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm transition-colors disabled:opacity-50">
              <Upload size={15} /> {uploading === 'appleTouchIcon' ? 'Upload...' : 'Uploader'}
            </button>
            <input ref={touchIconRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleIconUpload('appleTouchIcon', f); e.target.value = ''; }} />
          </div>
          <FormField label="Ou URL externe" value={local.appleTouchIcon?.startsWith('data:') ? '' : (local.appleTouchIcon || '')}
            onChange={(v) => setLocal((prev: typeof logoConfig) => ({ ...prev, appleTouchIcon: v }))}
            placeholder="https://exemple.com/apple-touch-icon.png" />
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default LogoSection;
