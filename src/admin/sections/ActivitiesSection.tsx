import React, { useState, useRef } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, FormSelect, StringListEditor, SectionCard, SaveButton } from '../AdminComponents';
import { SortableItem, DragSortContext, DragEndEvent, arrayMove } from '../SortableItem';

const COLOR_OPTIONS = [
  { value: 'orange', label: 'Orange' },
  { value: 'blue', label: 'Bleu nuit' },
  { value: 'purple', label: 'Violet' },
];

const ICON_OPTIONS = [
  { value: 'Code', label: 'Code' },
  { value: 'Network', label: 'Network (réseau)' },
  { value: 'Palette', label: 'Palette' },
  { value: 'Briefcase', label: 'Briefcase (valise)' },
  { value: 'Users', label: 'Users (utilisateurs)' },
  { value: 'Globe', label: 'Globe' },
];

const SUBJECT_OPTIONS = [
  { value: 'developpement-web', label: 'Développement Web & SaaS' },
  { value: 'services-entreprises', label: 'Services Entreprises' },
  { value: 'conception-3d', label: 'Conception 3D' },
  { value: 'autre', label: 'Autre' },
];

const ActivitiesSection: React.FC = () => {
  const { activitiesData, updateActivitiesData } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(activitiesData)));
  const [saved, setSaved] = useState(false);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateHeader = (field: string, value: string) =>
    setLocal((prev: typeof activitiesData) => ({ ...prev, [field]: value }));

  const updateActivity = (index: number, field: string, value: string | string[]) => {
    setLocal((prev: typeof activitiesData) => ({
      ...prev,
      activities: prev.activities.map((a: any, i: number) =>
        i === index ? { ...a, [field]: value } : a
      ),
    }));
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateActivity(index, 'image', (e.target?.result as string) || '');
    };
    reader.readAsDataURL(file);
  };

  const addActivity = () => {
    const newId = local.activities.length > 0
      ? Math.max(...local.activities.map((a: any) => a.id)) + 1
      : 1;
    setLocal((prev: typeof activitiesData) => ({
      ...prev,
      activities: [...prev.activities, {
        id: newId,
        title: `Activité ${newId}`,
        subtitle: 'Nouvelle activité',
        description: '',
        services: [''],
        color: 'orange',
        icon: 'Code',
        image: '',
        contactSubject: 'autre',
      }],
    }));
  };

  const removeActivity = (index: number) => {
    setLocal((prev: typeof activitiesData) => ({
      ...prev,
      activities: prev.activities.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocal((prev: typeof activitiesData) => {
      const items = prev.activities;
      const oldIndex = items.findIndex((a: any) => String(a.id) === String(active.id));
      const newIndex = items.findIndex((a: any) => String(a.id) === String(over.id));
      return { ...prev, activities: arrayMove(items, oldIndex, newIndex) };
    });
  };

  const handleSave = () => {
    updateActivitiesData(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <SectionCard title="En-tête de la section">
        <div className="space-y-4">
          <FormField label="Titre" value={local.title} onChange={(v) => updateHeader('title', v)} />
          <FormTextarea label="Sous-titre" value={local.subtitle} onChange={(v) => updateHeader('subtitle', v)} />
        </div>
      </SectionCard>

      <DragSortContext onDragEnd={handleDragEnd}>
      {local.activities.map((activity: any, index: number) => (
        <SortableItem key={String(activity.id)} id={String(activity.id)}>
          {(dragHandle) => (
        <SectionCard key={activity.id} title={`Activité ${index + 1} — ${activity.subtitle}`} defaultOpen={index === 0} dragHandle={dragHandle}>
          <div className="space-y-4">
            <div className="flex justify-end">
              <button type="button" onClick={() => removeActivity(index)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600">
                <Trash2 size={14} /> Supprimer cette activité
              </button>
            </div>

            <FormField label="Label (ex: Activité 1)" value={activity.title} onChange={(v) => updateActivity(index, 'title', v)} />
            <FormField label="Titre principal" value={activity.subtitle} onChange={(v) => updateActivity(index, 'subtitle', v)} />
            <FormTextarea label="Description" value={activity.description} onChange={(v) => updateActivity(index, 'description', v)} rows={4} />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect label="Couleur" value={activity.color} onChange={(v) => updateActivity(index, 'color', v)} options={COLOR_OPTIONS} />
              <FormSelect label="Icône" value={activity.icon} onChange={(v) => updateActivity(index, 'icon', v)} options={ICON_OPTIONS} />
            </div>

            {/* Image / Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image / Logo (même ligne que l'icône, côté droit)
              </label>
              {activity.image && (
                <div className="mb-2 flex items-center gap-3">
                  <img src={activity.image} alt="aperçu" className="h-16 w-auto object-contain border rounded" />
                  <button
                    type="button"
                    onClick={() => updateActivity(index, 'image', '')}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Supprimer l'image"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activity.image || ''}
                  onChange={(e) => updateActivity(index, 'image', e.target.value)}
                  placeholder="URL de l'image ou téléverser ci-dessous"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A] focus:border-transparent"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => { fileRefs.current[index] = el; }}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(index, file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRefs.current[index]?.click()}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm transition-colors"
                >
                  <Upload size={15} /> Fichier
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">L'image sera affichée en blanc sur le fond coloré.</p>
            </div>

            {/* Sujet de contact pré-rempli */}
            <FormSelect
              label="Sujet de contact pré-rempli (bouton 'Nous contacter')"
              value={activity.contactSubject || 'autre'}
              onChange={(v) => updateActivity(index, 'contactSubject', v)}
              options={SUBJECT_OPTIONS}
            />

            <StringListEditor label="Services inclus" items={activity.services}
              onChange={(v) => updateActivity(index, 'services', v)} placeholder="Ex: Création de sites internet" />
          </div>
        </SectionCard>
          )}
        </SortableItem>
      ))}
      </DragSortContext>

      <button type="button" onClick={addActivity}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#DC582A] hover:text-[#DC582A] transition-colors">
        <Plus size={18} /> Ajouter une activité
      </button>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default ActivitiesSection;
