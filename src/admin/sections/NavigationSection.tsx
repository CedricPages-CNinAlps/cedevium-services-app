import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, SectionCard, SaveButton } from '../AdminComponents';
import { SortableItem, DragSortContext, DragEndEvent, arrayMove } from '../SortableItem';

const NAV_ICON_OPTIONS = ['Home', 'Briefcase', 'Code', 'Gamepad2', 'Mail', 'Globe', 'Info', 'Star', 'Phone'];

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

  const addNavItem = () => {
    setLocalHeader((prev: typeof headerData) => ({
      ...prev,
      navigation: [...prev.navigation, { name: 'Nouveau lien', icon: 'Globe', href: '#section' }],
    }));
  };

  const removeNavItem = (index: number) => {
    setLocalHeader((prev: typeof headerData) => ({
      ...prev,
      navigation: prev.navigation.filter((_: typeof headerData.navigation[0], i: number) => i !== index),
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

  const addFooterLink = () => {
    setLocalFooter((prev: typeof footerData) => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        links: [...prev.quickLinks.links, { name: 'Nouveau lien', href: '#section' }],
      },
    }));
  };

  const removeFooterLink = (index: number) => {
    setLocalFooter((prev: typeof footerData) => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        links: prev.quickLinks.links.filter((_: typeof footerData.quickLinks.links[0], i: number) => i !== index),
      },
    }));
  };

  const handleNavDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    setLocalHeader((prev: typeof headerData) => ({
      ...prev,
      navigation: arrayMove(prev.navigation, oldIndex, newIndex),
    }));
  };

  const handleFooterLinkDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    setLocalFooter((prev: typeof footerData) => ({
      ...prev,
      quickLinks: {
        ...prev.quickLinks,
        links: arrayMove(prev.quickLinks.links, oldIndex, newIndex),
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
          <FormField label="Initiales du logo" value={localHeader.logo.text}
            onChange={(v) => setLocalHeader((prev: typeof headerData) => ({ ...prev, logo: { ...prev.logo, text: v } }))}
            placeholder="CS" />
          <FormField label="Nom de l'entreprise" value={localHeader.logo.company}
            onChange={(v) => setLocalHeader((prev: typeof headerData) => ({ ...prev, logo: { ...prev.logo, company: v } }))}
            placeholder="Cedevium Services" />
        </div>
      </SectionCard>

      <SectionCard title={`Liens de navigation (${localHeader.navigation.length})`}>
        <div className="space-y-3">
          <DragSortContext onDragEnd={handleNavDragEnd}>
              {localHeader.navigation.map((item: typeof headerData.navigation[0], index: number) => (
                <SortableItem key={index} id={String(index)}>
                  {(dragHandle) => (
                    <div className="flex gap-2 items-start border border-gray-100 rounded-lg p-3">
                      <div className="flex items-start pt-6 flex-shrink-0">{dragHandle}</div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <FormField label="Libellé" value={item.name} onChange={(v) => updateNavItem(index, 'name', v)} />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Icône</label>
                          <select value={item.icon} onChange={(e) => updateNavItem(index, 'icon', e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A]">
                            {NAV_ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <FormField label="Ancre (href)" value={item.href} onChange={(v) => updateNavItem(index, 'href', v)} placeholder="#section" />
                      </div>
                      <button type="button" onClick={() => removeNavItem(index)}
                        className="mt-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </SortableItem>
              ))}
          </DragSortContext>
          <button type="button" onClick={addNavItem}
            className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#DC582A] hover:text-[#DC582A] transition-colors">
            <Plus size={16} /> Ajouter un lien
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Footer — Entreprise" defaultOpen={false}>
        <div className="space-y-4">
          <FormField label="Nom de l'entreprise" value={localFooter.company.name}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({ ...prev, company: { ...prev.company, name: v } }))} />
          <FormField label="Initiales du logo" value={localFooter.company.logo}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({ ...prev, company: { ...prev.company, logo: v } }))} />
          <FormTextarea label="Description" value={localFooter.company.description}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({ ...prev, company: { ...prev.company, description: v } }))} />
          <FormField label="Copyright" value={localFooter.copyright}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({ ...prev, copyright: v }))} />
        </div>
      </SectionCard>

      <SectionCard title={`Footer — Liens rapides (${localFooter.quickLinks.links.length})`} defaultOpen={false}>
        <div className="space-y-3">
          <FormField label="Titre de la colonne" value={localFooter.quickLinks.title}
            onChange={(v) => setLocalFooter((prev: typeof footerData) => ({
              ...prev, quickLinks: { ...prev.quickLinks, title: v },
            }))} />
          <DragSortContext onDragEnd={handleFooterLinkDragEnd}>
              {localFooter.quickLinks.links.map((link: typeof footerData.quickLinks.links[0], index: number) => (
                <SortableItem key={index} id={String(index)}>
                  {(dragHandle) => (
                    <div className="flex gap-2 items-end">
                      <div className="flex items-end pb-0.5 flex-shrink-0">{dragHandle}</div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <FormField label="Libellé" value={link.name} onChange={(v) => updateFooterLink(index, 'name', v)} />
                        <FormField label="Ancre (href)" value={link.href} onChange={(v) => updateFooterLink(index, 'href', v)} />
                      </div>
                      <button type="button" onClick={() => removeFooterLink(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mb-0.5">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </SortableItem>
              ))}
          </DragSortContext>
          <button type="button" onClick={addFooterLink}
            className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#DC582A] hover:text-[#DC582A] transition-colors">
            <Plus size={16} /> Ajouter un lien
          </button>
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default NavigationSection;
