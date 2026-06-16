import React, { useState, useRef } from 'react';
import { Plus, Trash2, Upload, ExternalLink } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, SectionCard, SaveButton } from '../AdminComponents';
import { SortableItem, DragSortContext, DragEndEvent, arrayMove } from '../SortableItem';
import { PortfolioItem } from '../../contexts/AdminDataContext';

const PortfolioSection: React.FC = () => {
  const { portfolioData, updatePortfolioData } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(portfolioData)));
  const [saved, setSaved] = useState(false);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateHeader = (field: string, value: string) =>
    setLocal((prev: typeof portfolioData) => ({ ...prev, [field]: value }));

  const updateItem = (index: number, field: keyof PortfolioItem, value: string) => {
    setLocal((prev: typeof portfolioData) => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));
  };

  const addItem = () => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: 'Nouveau projet',
      url: '',
      image: '',
      description: '',
    };
    setLocal((prev: typeof portfolioData) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (index: number) => {
    setLocal((prev: typeof portfolioData) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => updateItem(index, 'image', (e.target?.result as string) || '');
    reader.readAsDataURL(file);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocal((prev: typeof portfolioData) => {
      const oldIndex = prev.items.findIndex((i: PortfolioItem) => i.id === String(active.id));
      const newIndex = prev.items.findIndex((i: PortfolioItem) => i.id === String(over.id));
      return { ...prev, items: arrayMove(prev.items, oldIndex, newIndex) };
    });
  };

  const handleSave = () => {
    updatePortfolioData(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <SectionCard title="En-tête de la section Portfolio">
        <div className="space-y-4">
          <FormField label="Titre" value={local.title} onChange={(v) => updateHeader('title', v)} />
          <FormField label="Sous-titre" value={local.subtitle} onChange={(v) => updateHeader('subtitle', v)} />
        </div>
      </SectionCard>

      {local.items.length === 0 && (
        <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
          <ExternalLink size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucune réalisation pour l'instant. Ajoutez votre premier projet ci-dessous.</p>
        </div>
      )}

      <DragSortContext onDragEnd={handleDragEnd}>
          {local.items.map((item: PortfolioItem, index: number) => (
            <SortableItem key={item.id} id={item.id}>
              {(dragHandle) => (
        <SectionCard key={item.id} title={`Projet ${index + 1} — ${item.title}`} defaultOpen={index === 0} dragHandle={dragHandle}>
          <div className="space-y-4">
            <div className="flex justify-end">
              <button type="button" onClick={() => removeItem(index)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600">
                <Trash2 size={14} /> Supprimer ce projet
              </button>
            </div>

            <FormField label="Titre du projet" value={item.title} onChange={(v) => updateItem(index, 'title', v)} />
            <FormField
              label="URL du site (ouvert au clic)"
              value={item.url}
              onChange={(v) => updateItem(index, 'url', v)}
              placeholder="https://exemple.com"
            />
            <FormTextarea
              label="Description (optionnel)"
              value={item.description}
              onChange={(v) => updateItem(index, 'description', v)}
              rows={2}
              placeholder="Courte description du projet..."
            />

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capture d'écran / Image</label>
              {item.image && (
                <div className="mb-3">
                  <img src={item.image} alt={item.title}
                    className="w-full max-h-48 object-cover rounded-lg border border-gray-200" />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.image}
                  onChange={(e) => updateItem(index, 'image', e.target.value)}
                  placeholder="URL de l'image ou téléverser..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A] focus:border-transparent"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => { fileRefs.current[index] = el; }}
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(index, f); }}
                />
                <button
                  type="button"
                  onClick={() => fileRefs.current[index]?.click()}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm transition-colors whitespace-nowrap"
                >
                  <Upload size={15} /> Fichier
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
              )}
            </SortableItem>
          ))}
      </DragSortContext>

      <button type="button" onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#DC582A] hover:text-[#DC582A] transition-colors">
        <Plus size={18} /> Ajouter un projet
      </button>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default PortfolioSection;
