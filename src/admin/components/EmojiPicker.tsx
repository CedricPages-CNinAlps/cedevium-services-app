import React, { useState, useRef, useEffect } from 'react';

const EMOJI_CATEGORIES = [
  {
    label: 'Jeux',
    emojis: ['🎮', '🎲', '🃏', '♟️', '🎯', '🎳', '🎰', '🎭', '🎪', '🎬', '🔮', '🧩', '🪀', '🪁', '🎻', '🎸', '🥁', '🎹', '🎺', '🎷', '🪄', '🎠', '🎡', '🎢', '🎟️', '🎆', '🎇', '🧸', '🪆', '🪅', '🎴', '🀄', '🎑', '🎏', '🎐', '🧨', '🪃', '🏏', '🏑', '🏒'],
  },
  {
    label: 'Sports',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '🏹', '🎣', '🤿', '🎽', '🛷', '🛹', '🛼', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🏋️', '🤼', '🤸', '🤺', '🏇', '⛹️', '🤾', '🏌️', '🏄', '🚣', '🧗', '🚵', '🚴', '🏊', '🏃', '🧘', '🧜', '🤽', '🏇', '🤹', '🏋️'],
  },
  {
    label: 'Équipe',
    emojis: ['👥', '🤝', '💪', '🧠', '🗣️', '👊', '🙌', '🫱', '🤜', '🤛', '🫂', '👫', '🫶', '👐', '🤲', '🙏', '✌️', '🤞', '🤙', '👋', '🫵', '💬', '💭', '🗨️', '📢', '📣', '🔊', '👁️', '👀', '🫀', '🫁', '🦾', '🦿', '🤓', '😎', '🧐', '🤩', '😄', '🥳', '🎓'],
  },
  {
    label: 'Nature',
    emojis: ['🌲', '🌳', '🌴', '🌵', '🎋', '🎍', '🍀', '🌿', '🌱', '🪴', '🌾', '🌷', '🌹', '🌸', '🌺', '🌻', '🌼', '💐', '🍄', '🏕️', '🌊', '🏔️', '⛰️', '🗻', '🏖️', '🏜️', '🏝️', '🌋', '🌍', '🌎', '🌏', '🌞', '🌝', '🌙', '⭐', '🌤️', '⛅', '🌈', '❄️', '☃️', '⛄', '🌬️', '🌀', '🌩️', '⛈️', '🌧️', '☔', '🌊', '💧'],
  },
  {
    label: 'Animaux',
    emojis: ['🦁', '🐯', '🐻', '🦊', '🐺', '🦝', '🐗', '🦌', '🦒', '🦓', '🐘', '🦏', '🦛', '🐪', '🦘', '🦙', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦬', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦤', '🦚', '🦜', '🦩', '🦢', '🦅', '🦆', '🦉', '🦇', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🦕'],
  },
  {
    label: 'Récompenses',
    emojis: ['🏆', '🥇', '🥈', '🥉', '🎖️', '🏅', '🎗️', '🎀', '🎁', '🎊', '🎉', '🎈', '🎆', '🎇', '✨', '🌟', '⭐', '💫', '🌠', '🔆', '💎', '👑', '🎓', '📜', '🏵️', '🎪', '🥂', '🍾', '🎺', '📯'],
  },
  {
    label: 'Aventure',
    emojis: ['🚀', '🛸', '✈️', '🚁', '⛵', '🚤', '🛥️', '🚂', '🚃', '🚄', '🛺', '🏍️', '🚵', '🧭', '🗺️', '⛺', '🏚️', '🏰', '🗼', '🗽', '🗿', '🏛️', '⛩️', '🕌', '🕍', '🛕', '🌁', '🌃', '🌆', '🌇', '🎑', '🏞️', '🌄', '🌅', '🌌', '🌉', '🔭', '🪂', '🤿'],
  },
  {
    label: 'Objets',
    emojis: ['💡', '🔥', '⚡', '💥', '🎵', '🎶', '🎨', '🖌️', '✏️', '📝', '📚', '🔬', '🔭', '🧪', '🧬', '🔑', '🗝️', '🔒', '🔓', '🧲', '⏱️', '⏰', '🕰️', '⌚', '📡', '🖥️', '📱', '📷', '🎥', '💰', '💳', '🧰', '🪛', '🔧', '🔨', '⚙️', '🪝', '🧯', '🪜', '🧳'],
  },
  {
    label: 'Nourriture',
    emojis: ['🍕', '🍔', '🌮', '🌯', '🥗', '🍣', '🍱', '🍜', '🍝', '🍛', '🥘', '🍲', '🫕', '🥙', '🧆', '🥚', '🍳', '🥞', '🧇', '🥓', '🍗', '🍖', '🌭', '🍟', '🍿', '🧂', '🥨', '🥯', '🧁', '🎂', '🍰', '🍩', '🍪', '🍫', '🍬', '🍭', '🍮', '🍦', '🍧', '🍨'],
  },
  {
    label: 'Émotions',
    emojis: ['😀', '😃', '😄', '😁', '😆', '🥹', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '🫠', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤩'],
  },
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (emoji: string) => {
    onChange(emoji);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:border-[#DC582A] focus:outline-none focus:ring-2 focus:ring-[#DC582A] transition-colors w-full"
      >
        <span className="text-2xl leading-none">{value}</span>
        <span className="text-gray-500 text-xs">Changer</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-xl w-72">
          {/* Onglets catégories */}
          <div className="flex overflow-x-auto border-b border-gray-100 px-2 pt-2 gap-1">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(i)}
                className="flex-shrink-0 px-2 py-1 text-xs rounded-t-lg font-medium transition-colors"
                style={{
                  background: activeCategory === i ? '#DC582A' : 'transparent',
                  color: activeCategory === i ? 'white' : '#6b7280',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grille emojis */}
          <div className="p-3 grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            {EMOJI_CATEGORIES[activeCategory].emojis.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSelect(emoji)}
                className="text-xl p-1 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center"
                style={{ lineHeight: 1 }}
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
