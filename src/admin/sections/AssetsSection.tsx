import React, { useState, useRef } from 'react';
import { Upload, Trash2, Copy, Link, CheckCircle } from 'lucide-react';
import { useAssets } from '../../hooks/useAssets';
import { SectionCard } from '../AdminComponents';

const AssetsSection: React.FC = () => {
  const { assets, addAsset, addAssetFromUrl, removeAsset } = useAssets();
  const [urlInput, setUrlInput] = useState('');
  const [urlName, setUrlName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setError('');
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        await addAsset(file);
      } catch (e: any) {
        setError(e.message);
      }
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    addAssetFromUrl(urlInput.trim(), urlName.trim());
    setUrlInput('');
    setUrlName('');
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} Ko` : `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
        <strong>Note :</strong> Les médias uploadés sont stockés dans votre navigateur (localStorage). Ils restent disponibles sur cet appareil. Pour une utilisation multi-appareils, utilisez des URLs externes (Cloudinary, ImgBB, etc.) via l'onglet URL ci-dessous.
      </div>

      <SectionCard title="Uploader des fichiers">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#DC582A] hover:bg-orange-50 transition-all"
        >
          <Upload size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600 font-medium">Glisser-déposer ou cliquer pour uploader</p>
          <p className="text-xs text-gray-400 mt-1">Images (PNG, JPG, SVG, GIF) · Max 4 Mo par fichier</p>
          {uploading && <p className="text-sm text-[#DC582A] mt-2">Upload en cours...</p>}
        </div>
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </SectionCard>

      <SectionCard title="Ajouter via URL externe" defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image ou vidéo</label>
            <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemple.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom (optionnel)</label>
            <input type="text" value={urlName} onChange={(e) => setUrlName(e.target.value)}
              placeholder="mon-image"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A]" />
          </div>
          <button type="button" onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-40 transition-colors"
            style={{ background: '#DC582A' }}>
            <Link size={16} /> Ajouter cette URL
          </button>
        </div>
      </SectionCard>

      <SectionCard title={`Médiathèque (${assets.length} fichier${assets.length !== 1 ? 's' : ''})`}>
        {assets.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Aucun media uploadé pour l'instant.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {assets.map(asset => (
              <div key={asset.id} className="border border-gray-200 rounded-xl overflow-hidden group relative">
                {asset.type === 'image' ? (
                  <img src={asset.dataUrl} alt={asset.name}
                    className="w-full h-32 object-cover bg-gray-50" />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-700 truncate" title={asset.name}>{asset.name}</p>
                  {asset.size && <p className="text-xs text-gray-400">{formatSize(asset.size)}</p>}
                  <div className="flex gap-1 mt-2">
                    <button type="button" onClick={() => copyUrl(asset.id, asset.dataUrl)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      title="Copier l'URL">
                      {copiedId === asset.id ? <CheckCircle size={13} className="text-green-500" /> : <Copy size={13} />}
                      {copiedId === asset.id ? 'Copié !' : 'Copier URL'}
                    </button>
                    <button type="button" onClick={() => removeAsset(asset.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AssetsSection;
