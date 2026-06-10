import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, SectionCard, SaveButton } from '../AdminComponents';

const HeroSection: React.FC = () => {
  const { heroData, images, updateHeroData, updateImages } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(heroData)));
  const [localImages, setLocalImages] = useState(() => JSON.parse(JSON.stringify(images)));
  const [saved, setSaved] = useState(false);

  const updateSlide = (index: number, field: string, value: string) => {
    setLocal((prev: typeof heroData) => ({
      ...prev,
      slides: prev.slides.map((s: typeof heroData.slides[0], i: number) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addSlide = () => {
    const newId = local.slides.length > 0
      ? Math.max(...local.slides.map((s: typeof heroData.slides[0]) => s.id)) + 1
      : 1;
    setLocal((prev: typeof heroData) => ({
      ...prev,
      slides: [...prev.slides, { id: newId, title: 'Nouveau titre', subtitle: 'Sous-titre', description: '', cta: 'En savoir plus' }],
    }));
  };

  const removeSlide = (index: number) => {
    if (local.slides.length <= 1) return;
    setLocal((prev: typeof heroData) => ({
      ...prev,
      slides: prev.slides.filter((_: typeof heroData.slides[0], i: number) => i !== index),
    }));
  };

  const updateSlider = (field: string, value: number) => {
    setLocal((prev: typeof heroData) => ({ ...prev, slider: { ...prev.slider, [field]: value } }));
  };

  const handleSave = () => {
    updateHeroData(local);
    updateImages(localImages);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Image de fond">
        <FormField
          label="URL de l'image de fond"
          value={localImages.hero.background}
          onChange={(v) => setLocalImages((prev: typeof images) => ({ ...prev, hero: { ...prev.hero, background: v } }))}
          placeholder="/cedevium-services-app/bonhomme-courses.jpg"
        />
        <p className="text-xs text-gray-400 mt-1">Entrez une URL externe ou le chemin relatif d'une image uploadée dans la médiathèque.</p>
      </SectionCard>

      {local.slides.map((slide: typeof heroData.slides[0], index: number) => (
        <SectionCard key={slide.id} title={`Slide ${index + 1} — ${slide.title}`} defaultOpen={index === 0}>
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeSlide(index)}
                disabled={local.slides.length <= 1}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} /> Supprimer ce slide
              </button>
            </div>
            <FormField label="Titre" value={slide.title} onChange={(v) => updateSlide(index, 'title', v)} />
            <FormField label="Sous-titre" value={slide.subtitle} onChange={(v) => updateSlide(index, 'subtitle', v)} />
            <FormTextarea label="Description" value={slide.description} onChange={(v) => updateSlide(index, 'description', v)} />
            <FormField label="Texte du bouton CTA" value={slide.cta} onChange={(v) => updateSlide(index, 'cta', v)} />
          </div>
        </SectionCard>
      ))}

      <button
        type="button"
        onClick={addSlide}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#DC582A] hover:text-[#DC582A] transition-colors"
      >
        <Plus size={18} /> Ajouter un slide
      </button>

      <SectionCard title="Configuration du slider" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intervalle auto (ms)</label>
            <input type="number" value={local.slider.autoPlayInterval}
              onChange={(e) => updateSlider('autoPlayInterval', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée animation (ms)</label>
            <input type="number" value={local.slider.animationDuration}
              onChange={(e) => updateSlider('animationDuration', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A]" />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <SaveButton onSave={handleSave} saved={saved} />
      </div>
    </div>
  );
};

export default HeroSection;
