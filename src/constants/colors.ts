// Constantes de couleurs Tailwind CSS
// Changez ces valeurs pour modifier les couleurs sur tout le site

export const COLORS = {
  // Couleurs principales (vous pouvez utiliser des codes hex)
  PRIMARY: {
    BLUE: 'blue-night',           // ou '#1e3a8a' pour un bleu nuit personnalisé
    ORANGE: 'orange',             // ou '#f97316' pour un orange personnalisé
    WHITE: 'white',
    GRAY: 'gray'
  },
  
  // Couleurs sémantiques
  SEMANTIC: {
    SUCCESS: 'green',
    WARNING: 'yellow',
    ERROR: 'red',
    INFO: 'blue'
  },
  
  // Gradients
  GRADIENTS: {
    PRIMARY: 'from-blue-night to-orange',
    SECONDARY: 'from-orange to-blue-night'
  },
  
  // Classes complètes pour faciliter l'utilisation
  CLASSES: {
    // Text colors
    TEXT_PRIMARY: 'text-blue-night',
    TEXT_ACCENT: 'text-orange',
    TEXT_WHITE: 'text-white',
    TEXT_GRAY: 'text-gray',
    
    // Background colors
    BG_PRIMARY: 'bg-blue-night',
    BG_ACCENT: 'bg-orange',
    BG_WHITE: 'bg-white',
    BG_GRAY: 'bg-gray',
    
    // Background avec opacité
    BG_ACCENT_LIGHT: 'bg-orange/10',
    BG_ACCENT_HOVER: 'bg-orange/20',
    BG_PRIMARY_DARK: 'bg-blue-night/80',
    
    // Border colors
    BORDER_ACCENT: 'border-orange',
    BORDER_PRIMARY: 'border-blue-night',
    
    // Focus colors
    FOCUS_ACCENT: 'focus:ring-orange',
    FOCUS_PRIMARY: 'focus:ring-blue-night',
    
    // Hover colors
    HOVER_ACCENT: 'hover:bg-orange',
    HOVER_ACCENT_LIGHT: 'hover:bg-orange/90',
    HOVER_TEXT_ACCENT: 'hover:text-orange',
    HOVER_PRIMARY: 'hover:bg-blue-night',
    HOVER_PRIMARY_LIGHT: 'hover:bg-blue-night/90'
  }
} as const;

// Export par défaut pour faciliter l'import
export default COLORS;
