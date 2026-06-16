import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, FormSelect, StringListEditor, SectionCard, SaveButton } from '../AdminComponents';
import { SortableItem } from '../SortableItem';

const ICON_OPTIONS = [
  { value: 'Code', label: 'Code' },
  { value: 'Cpu', label: 'Cpu (processeur)' },
  { value: 'Users', label: 'Users (utilisateurs)' },
  { value: 'Palette', label: 'Palette' },
  { value: 'Briefcase', label: 'Briefcase (valise)' },
  { value: 'Globe', label: 'Globe' },
  { value: 'Settings', label: 'Settings (engrenage)' },
  { value: 'Star', label: 'Star (étoile)' },
];

const ServicesSection: React.FC = () => {
  const { servicesData, updateServicesData } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(servicesData)));
  const [saved, setSaved] = useState(false);

  const updateHeader = (field: string, value: string) =>
    setLocal((prev: typeof servicesData) => ({ ...prev, [field]: value }));

  const updateService = (index: number, field: string, value: string | string[]) => {
    setLocal((prev: typeof servicesData) => ({
      ...prev,
      services: prev.services.map((s: any, i: number) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addService = () => {
    const newId = local.services.length > 0
      ? Math.max(...local.services.map((s: any) => s.id)) + 1
      : 1;
    setLocal((prev: typeof servicesData) => ({
      ...prev,
      services: [...prev.services, { id: newId, title: 'Nouveau service', description: '', features: [''], icon: 'Star' }],
    }));
  };

  const removeService = (index: number) => {
    setLocal((prev: typeof servicesData) => ({
      ...prev,
      services: prev.services.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocal((prev: typeof servicesData) => {
      const items = prev.services;
      const oldIndex = items.findIndex((s: any) => String(s.id) === String(active.id));
      const newIndex = items.findIndex((s: any) => String(s.id) === String(over.id));
      return { ...prev, services: arrayMove(items, oldIndex, newIndex) };
    });
  };

  const handleSave = () => {
    updateServicesData(local);
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

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={local.services.map((s: any) => String(s.id))}
          strategy={verticalListSortingStrategy}
        >
          {local.services.map((service: any, index: number) => (
            <SortableItem key={String(service.id)} id={String(service.id)}>
              {(dragHandle) => (
                <SectionCard
                  title={`Service ${index + 1} — ${service.title}`}
                  defaultOpen={index === 0}
                  dragHandle={dragHandle}
                >
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button type="button" onClick={() => removeService(index)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600">
                        <Trash2 size={14} /> Supprimer ce service
                      </button>
                    </div>
                    <FormField label="Titre" value={service.title} onChange={(v) => updateService(index, 'title', v)} />
                    <FormTextarea label="Description" value={service.description} onChange={(v) => updateService(index, 'description', v)} />
                    <FormSelect label="Icône" value={service.icon} onChange={(v) => updateService(index, 'icon', v)} options={ICON_OPTIONS} />
                    <StringListEditor label="Fonctionnalités" items={service.features}
                      onChange={(v) => updateService(index, 'features', v)} placeholder="Ex: Sites vitrine" />
                  </div>
                </SectionCard>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <button type="button" onClick={addService}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#DC582A] hover:text-[#DC582A] transition-colors">
        <Plus size={18} /> Ajouter un service
      </button>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default ServicesSection;
