import React, { useState } from 'react';
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

  const updateSlider = (field: string, value: number) => {
    setLocal((prev: typeof heroData) => ({
      ...prev,
      slider: { ...prev.slider, [field]: value },
    }));
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
      </SectionCard>

      {local.slides.map((slide: typeof heroData.slides[0], index: number) => (
        <SectionCard key={slide.id} title={`Slide ${index + 1}`} defaultOpen={index === 0}>
          <div className="space-y-4">
            <FormField
              label="Titre"
              value={slide.title}
              onChange={(v) => updateSlide(index, 'title', v)}
            />
            <FormField
              label="Sous-titre"
              value={slide.subtitle}
              onChange={(v) => updateSlide(index, 'subtitle', v)}
            />
            <FormTextarea
              label="Description"
              value={slide.description}
              onChange={(v) => updateSlide(index, 'description', v)}
            />
            <FormField
              label="Texte du bouton CTA"
              value={slide.cta}
              onChange={(v) => updateSlide(index, 'cta', v)}
            />
          </div>
        </SectionCard>
      ))}

      <SectionCard title="Configuration du slider" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intervalle auto (ms)</label>
            <input
              type="number"
              value={local.slider.autoPlayInterval}
              onChange={(e) => updateSlider('autoPlayInterval', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée animation (ms)</label>
            <input
              type="number"
              value={local.slider.animationDuration}
              onChange={(e) => updateSlider('animationDuration', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DC582A]"
            />
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
