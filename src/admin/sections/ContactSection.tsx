import React, { useState } from 'react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, StringListEditor, SectionCard, SaveButton } from '../AdminComponents';

const ContactSection: React.FC = () => {
  const { contactData, updateContactData } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(contactData)));
  const [saved, setSaved] = useState(false);

  const updateField = (path: string[], value: string) => {
    setLocal((prev: typeof contactData) => {
      const next = JSON.parse(JSON.stringify(prev));
      let obj: Record<string, any> = next;
      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateContactItem = (index: number, field: string, value: string) => {
    setLocal((prev: typeof contactData) => ({
      ...prev,
      info: {
        ...prev.info,
        items: prev.info.items.map((item: typeof contactData.info.items[0], i: number) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleSave = () => {
    updateContactData(local);
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
            onChange={(v) => updateField(['title'], v)}
          />
          <FormTextarea
            label="Sous-titre"
            value={local.subtitle}
            onChange={(v) => updateField(['subtitle'], v)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Informations de contact">
        <div className="space-y-6">
          {local.info.items.map((item: typeof contactData.info.items[0], index: number) => (
            <div key={index} className="space-y-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.type}</p>
              <FormField
                label="Titre affiché"
                value={item.title}
                onChange={(v) => updateContactItem(index, 'title', v)}
              />
              <FormField
                label="Contenu"
                value={item.content}
                onChange={(v) => updateContactItem(index, 'content', v)}
                placeholder={index === 0 ? 'email@exemple.fr' : index === 1 ? '+33 6 00 00 00 00' : 'France'}
              />
              <FormField
                label="Lien (action au clic)"
                value={item.action}
                onChange={(v) => updateContactItem(index, 'action', v)}
                placeholder={index === 0 ? 'mailto:email@exemple.fr' : index === 1 ? 'tel:+33600000000' : '#'}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Pourquoi nous choisir ?">
        <div className="space-y-4">
          <FormField
            label="Titre de la section"
            value={local.whyChooseUs.title}
            onChange={(v) => updateField(['whyChooseUs', 'title'], v)}
          />
          <StringListEditor
            label="Points"
            items={local.whyChooseUs.points}
            onChange={(v) => setLocal((prev: typeof contactData) => ({
              ...prev,
              whyChooseUs: { ...prev.whyChooseUs, points: v },
            }))}
            placeholder="Ex: Expertise dans 3 domaines"
          />
        </div>
      </SectionCard>

      <SectionCard title="Formulaire" defaultOpen={false}>
        <div className="space-y-4">
          <FormField
            label="Titre du formulaire"
            value={local.form.title}
            onChange={(v) => updateField(['form', 'title'], v)}
          />
          <FormField
            label="Texte du bouton d'envoi"
            value={local.form.submitButton.text}
            onChange={(v) => updateField(['form', 'submitButton', 'text'], v)}
          />
          <FormField
            label="Texte pendant l'envoi"
            value={local.form.submitButton.loadingText}
            onChange={(v) => updateField(['form', 'submitButton', 'loadingText'], v)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Message de succès" defaultOpen={false}>
        <div className="space-y-4">
          <FormField
            label="Titre"
            value={local.successMessage.title}
            onChange={(v) => updateField(['successMessage', 'title'], v)}
          />
          <FormTextarea
            label="Texte"
            value={local.successMessage.text}
            onChange={(v) => updateField(['successMessage', 'text'], v)}
          />
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default ContactSection;
