import React, { useState } from 'react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, SectionCard, SaveButton } from '../AdminComponents';

const NavigationSection: React.FC = () => {
  const { headerData, footerData, updateHeaderData, updateFooterData } = useAdminData();
  const [localHeader, setLocalHeader] = useState(() => JSON.parse(JSON.stringify(headerData)));
  const [localFooter, setLocalFooter] = useState(() => JSON.parse(JSON.stringify(footerData)));
  const [saved, setSaved] = useState(false);

  const updateNavItem = (index: number, field: string, value: string) => {
    setLocalHeader((prev: typeof headerData) => ({
      ...prev,
      navigation: prev.navigation.map((item: typeof headerData.navigation[0], i: number) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateFooterLink = (index: number, field: string, value: string) => {
    setLocalFooter((prev: typeof footerData) => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        links: prev.quickLinks.links.map((link: typeof footerData.quickLinks.links[0], i: number) =>
          i === index ? { ...link, [field]: value } : link
        ),
      },
    }));
  };

  const handleSave = () => {
    updateHeaderData(localHeader);
    updateFooterData(localFooter);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Logo & En-tête">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Initiales du logo"
            value={localHeader.logo.text}
            onChange={(v) => setLocalHeader((prev: typeof headerData) => ({
              ...prev,
              logo: { ...prev.logo, text: v },
            }))}
            placeholder="CS"
          />
          <FormField
            label="Nom de l'entreprise"
            value={localHeader.logo.company}
            onChange={(v) => setLocalHeader((prev: typeof headerData) => ({
              ...prev,
              logo: { ...prev.logo, company: v },
            }))}
            placeholder="Cedevium Services"
          />
        </div>
      </SectionCard>

      <SectionCard title="Liens de navigation">
        <div className="space-y-4">
          {localHeader.navigation.map((item: typeof headerData.navigation[0], index: number) => (
            <div key={index} className="grid grid-cols-2 gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <FormField
                label="Libellé"
                value={item.name}
                onChange={(v) => updateNavItem(index, 'name', v)}
              />
              <FormField
                label="Ancre (href)"
                value={item.href}
                onChange={(v) => updateNavItem(index, 'href', v)}
                placeholder="#section"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Footer — Entreprise">
        <div className="space-y-4">
          <FormField
            label="Nom de l'entreprise"
            value={localFooter.company.name}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({
              ...prev,
              company: { ...prev.company, name: v },
            }))}
          />
          <FormField
            label="Initiales du logo"
            value={localFooter.company.logo}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({
              ...prev,
              company: { ...prev.company, logo: v },
            }))}
          />
          <FormTextarea
            label="Description"
            value={localFooter.company.description}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({
              ...prev,
              company: { ...prev.company, description: v },
            }))}
          />
          <FormField
            label="Copyright"
            value={localFooter.copyright}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({
              ...prev,
              copyright: v,
            }))}
          />
        </div>
      </SectionCard>

      <SectionCard title="Footer — Liens rapides" defaultOpen={false}>
        <div className="space-y-4">
          <FormField
            label="Titre de la colonne"
            value={localFooter.quickLinks.title}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({
              ...prev,
              quickLinks: { ...prev.quickLinks, title: v },
            }))}
          />
          {localFooter.quickLinks.links.map((link: typeof footerData.quickLinks.links[0], index: number) => (
            <div key={index} className="grid grid-cols-2 gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <FormField
                label="Libellé"
                value={link.name}
                onChange={(v) => updateFooterLink(index, 'name', v)}
              />
              <FormField
                label="Ancre (href)"
                value={link.href}
                onChange={(v) => updateFooterLink(index, 'href', v)}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default NavigationSection;
