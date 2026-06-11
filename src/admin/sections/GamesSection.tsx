import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminData } from '../../contexts/AdminDataContext';
import { FormField, FormTextarea, FormSelect, SectionCard, SaveButton } from '../AdminComponents';
import EmojiPicker from '../components/EmojiPicker';

const DIFFICULTY_OPTIONS = [
  { value: 'Facile', label: 'Facile' },
  { value: 'Moyen', label: 'Moyen' },
  { value: 'Difficile', label: 'Difficile' },
];

const GamesSection: React.FC = () => {
  const { gamesData, updateGamesData } = useAdminData();
  const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(gamesData)));
  const [saved, setSaved] = useState(false);

  const updateHeader = (field: string, value: string) => {
    setLocal((prev: typeof gamesData) => ({ ...prev, [field]: value }));
  };

  const updateGame = (index: number, field: string, value: string) => {
    setLocal((prev: typeof gamesData) => ({
      ...prev,
      games: prev.games.map((g: typeof gamesData.games[0], i: number) =>
        i === index ? { ...g, [field]: value } : g
      ),
    }));
  };

  const removeGame = (index: number) => {
    setLocal((prev: typeof gamesData) => ({
      ...prev,
      games: prev.games.filter((_: typeof gamesData.games[0], i: number) => i !== index),
    }));
  };

  const addGame = () => {
    const newId = local.games.length > 0 ? Math.max(...local.games.map((g: typeof gamesData.games[0]) => g.id)) + 1 : 1;
    setLocal((prev: typeof gamesData) => ({
      ...prev,
      games: [...prev.games, {
        id: newId,
        name: 'Nouveau jeu',
        emoji: '🎮',
        description: '',
        difficulty: 'Facile',
        duration: '30 min',
        players: '2-6 joueurs',
      }],
    }));
  };

  const updateBenefit = (index: number, field: string, value: string) => {
    setLocal((prev: typeof gamesData) => ({
      ...prev,
      benefits: prev.benefits.map((b: typeof gamesData.benefits[0], i: number) =>
        i === index ? { ...b, [field]: value } : b
      ),
    }));
  };

  const handleSave = () => {
    updateGamesData(local);
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

      <SectionCard title={`Jeux (${local.games.length})`}>
        <div className="space-y-4">
          {local.games.map((game: typeof gamesData.games[0], index: number) => (
            <div key={game.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-800 text-sm">{game.emoji} {game.name}</span>
                <button
                  type="button"
                  onClick={() => removeGame(index)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Nom"
                  value={game.name}
                  onChange={(v) => updateGame(index, 'name', v)}
                />
                <EmojiPicker
                  value={game.emoji}
                  onChange={(v) => updateGame(index, 'emoji', v)}
                />
                <FormSelect
                  label="Difficulté"
                  value={game.difficulty}
                  onChange={(v) => updateGame(index, 'difficulty', v)}
                  options={DIFFICULTY_OPTIONS}
                />
                <FormField
                  label="Durée"
                  value={game.duration}
                  onChange={(v) => updateGame(index, 'duration', v)}
                  placeholder="30-60 min"
                />
                <div className="col-span-2">
                  <FormField
                    label="Nombre de joueurs"
                    value={game.players}
                    onChange={(v) => updateGame(index, 'players', v)}
                    placeholder="2-6 joueurs"
                  />
                </div>
                <div className="col-span-2">
                  <FormTextarea
                    label="Description"
                    value={game.description}
                    onChange={(v) => updateGame(index, 'description', v)}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addGame}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#DC582A] hover:text-[#DC582A] transition-colors"
          >
            <Plus size={18} />
            Ajouter un jeu
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Avantages de nos jeux" defaultOpen={false}>
        <div className="space-y-4">
          {local.benefits.map((benefit: typeof gamesData.benefits[0], index: number) => (
            <div key={index} className="space-y-2 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <FormField
                label={`Titre avantage ${index + 1}`}
                value={benefit.title}
                onChange={(v) => updateBenefit(index, 'title', v)}
              />
              <FormTextarea
                label="Description"
                value={benefit.description}
                onChange={(v) => updateBenefit(index, 'description', v)}
                rows={2}
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

export default GamesSection;
