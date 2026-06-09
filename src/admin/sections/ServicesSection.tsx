import React, { useState } from 'react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, FormSelect, StringListEditor, SectionCard, SaveButton } from '../AdminComponents';

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

  const updateHeader = (field: string, value: string) => {
    setLocal((prev: typeof servicesData) => ({ ...prev, [field]: value }));
  };

  const updateService = (index: number, field: string, value: string | string[]) => {
    setLocal((prev: typeof servicesData) => ({
      ...prev,
      services: prev.services.map((s: typeof servicesData.services[0], i: number) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
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
          <FormField
            label="Titre"
            value={local.title}
            onChange={(v) => updateHeader('title', v)}
          />
          <FormTextarea
            label="Sous-titre"
            value={local.subtitle}
            onChange={(v) => updateHeader('subtitle', v)}
          />
        </div>
      </SectionCard>

      {local.services.map((service: typeof servicesData.services[0], index: number) => (
        <SectionCard key={service.id} title={`Service ${index + 1} — ${service.title}`} defaultOpen={index === 0}>
          <div className="space-y-4">
            <FormField
              label="Titre"
              value={service.title}
              onChange={(v) => updateService(index, 'title', v)}
            />
            <FormTextarea
              label="Description"
              value={service.description}
              onChange={(v) => updateService(index, 'description', v)}
            />
            <FormSelect
              label="Icône"
              value={service.icon}
              onChange={(v) => updateService(index, 'icon', v)}
              options={ICON_OPTIONS}
            />
            <StringListEditor
              label="Fonctionnalités"
              items={service.features}
              onChange={(v) => updateService(index, 'features', v)}
              placeholder="Ex: Sites vitrine"
            />
          </div>
        </SectionCard>
      ))}

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default ServicesSection;
