import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, FormSelect, StringListEditor, SectionCard, SaveButton } from '../AdminComponents';

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

const ActivitiesSection: React.FC = () => {
  const { activitiesData, updateActivitiesData } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(activitiesData)));
  const [saved, setSaved] = useState(false);

  const updateHeader = (field: string, value: string) =>
    setLocal((prev: typeof activitiesData) => ({ ...prev, [field]: value }));

  const updateActivity = (index: number, field: string, value: string | string[]) => {
    setLocal((prev: typeof activitiesData) => ({
      ...prev,
      activities: prev.activities.map((a: typeof activitiesData.activities[0], i: number) =>
        i === index ? { ...a, [field]: value } : a
      ),
    }));
  };

  const addActivity = () => {
    const newId = local.activities.length > 0
      ? Math.max(...local.activities.map((a: typeof activitiesData.activities[0]) => a.id)) + 1
      : 1;
    setLocal((prev: typeof activitiesData) => ({
      ...prev,
      activities: [...prev.activities, {
        id: newId, title: `Activité ${newId}`, subtitle: 'Nouvelle activité',
        description: '', services: [''], color: 'orange', icon: 'Code',
      }],
    }));
  };

  const removeActivity = (index: number) => {
    setLocal((prev: typeof activitiesData) => ({
      ...prev,
      activities: prev.activities.filter((_: typeof activitiesData.activities[0], i: number) => i !== index),
    }));
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

      {local.activities.map((activity: typeof activitiesData.activities[0], index: number) => (
        <SectionCard key={activity.id} title={`Activité ${index + 1} — ${activity.subtitle}`} defaultOpen={index === 0}>
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
            <StringListEditor label="Services inclus" items={activity.services}
              onChange={(v) => updateActivity(index, 'services', v)} placeholder="Ex: Création de sites internet" />
          </div>
        </SectionCard>
      ))}

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
