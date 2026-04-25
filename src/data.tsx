// Couleurs du site
export const colors = {
  primary: {
    blue: 'blue-night',
    orange: 'orange',
    white: 'white',
    gray: 'gray'
  },
  semantic: {
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue'
  },
  gradients: {
    primary: 'from-blue-night to-orange',
    secondary: 'from-orange to-blue-night'
  }
};

// Images du site
export const images = {
  hero: {
    background: '/cedevium-services-app/bonhomme-courses.jpg',
    logo: '/logo192.png',
    favicon: '/favicon.ico'
  },
  company: {
    logo512: '/logo512.png',
    logo192: '/logo192.png'
  }
};

// Données du composant Hero
export const heroData = {
  slides: [
    {
      id: 1,
      title: "Développement Web & SaaS",
      subtitle: "Des solutions sur mesure pour votre entreprise",
      description: "Création de sites internet, applications SaaS et automatisation de vos processus documentaires",
      cta: "Découvrir nos services"
    },
    {
      id: 2,
      title: "Services Entreprises",
      subtitle: "Votre partenaire pour le développement",
      description: "Aide divers sur vos activités, communication, services web et animation d'événements",
      cta: "En savoir plus"
    },
    {
      id: 3,
      title: "Conception 3D",
      subtitle: "L'aménagement professionnel sans limite",
      description: "Conception 3D pour professionnels et particuliers (cuisine, dressing, etc.) sans activité de montage",
      cta: "Explorer nos projets"
    }
  ],
  slider: {
    autoPlayInterval: 5000,
    animationDuration: 500
  }
};

// Données du composant Services
export const servicesData = {
  title: "Nos Services",
  subtitle: "Des solutions complètes pour répondre à tous vos besoins digitaux et professionnels",
  services: [
    {
      id: 1,
      title: "Développement Web",
      description: "Création de sites internet modernes et responsive",
      features: ["Sites vitrine", "Applications web", "E-commerce", "Maintenance"],
      icon: "Code"
    },
    {
      id: 2,
      title: "SaaS & Automatisation",
      description: "Plateformes SaaS pour automatiser vos processus",
      features: ["Génération de documents", "Automatisation", "SaaS sur mesure", "Intégration"],
      icon: "Cpu"
    },
    {
      id: 3,
      title: "Services Entreprises",
      description: "Accompagnement pour vos projets professionnels",
      features: ["Communication", "Événements", "Animation", "Conseil"],
      icon: "Users"
    },
    {
      id: 4,
      title: "Conception 3D",
      description: "Aménagement professionnel sans activité de montage",
      features: ["Cuisine", "Dressing", "Aménagement", "Visualisation 3D"],
      icon: "Palette"
    }
  ]
};

// Données du composant Activities
export const activitiesData = {
  title: "Nos Activités",
  subtitle: "Découvrez nos trois pôles d'expertise pour accompagner votre développement",
  activities: [
    {
      id: 1,
      title: "Activité 1",
      subtitle: "Développement Web & SaaS",
      description: "Prestation de service de développement web et commercialisation d'un abonnement sur une plateforme SaaS (Software As A Service) visant à automatiser des processus réglementaires de génération de documents.",
      services: [
        "Création de sites internet",
        "Développements web spécifiques",
        "Refonte de sites internet",
        "Maintenance de sites internet"
      ],
      color: "orange",
      icon: "Code"
    },
    {
      id: 2,
      title: "Activité 2",
      subtitle: "Services Entreprises",
      description: "Prestation de services divers pour des entreprises, aide divers sur leurs activités, communications et services web, évènement de groupe et animation.",
      services: [
        "Aide sur vos activités",
        "Services de communication",
        "Services web pour entreprises",
        "Événements de groupe et animation"
      ],
      color: "blue",
      icon: "Network"
    },
    {
      id: 3,
      title: "Activité 3",
      subtitle: "Conception 3D",
      description: "Prestation de service d'aide à la conception 3D sur les logiciels d'aménagement professionnels pour les professionnels et particuliers (cuisine, dressing, etc.) sans activité de montage.",
      services: [
        "Conception 3D professionnelle",
        "Aménagement de cuisine",
        "Conception de dressing",
        "Projets pour particuliers et professionnels"
      ],
      color: "orange",
      icon: "Palette"
    }
  ]
};

// Données du composant Contact
export const contactData = {
  title: "Contactez Nous",
  subtitle: "Une question ? Un projet ? Discutons-en ensemble et trouvons la solution idéale pour vos besoins",
  form: {
    title: "Envoyez-nous un message",
    fields: {
      name: {
        label: "Nom complet",
        placeholder: "Jean Dupont",
        required: true
      },
      email: {
        label: "Email",
        placeholder: "jean@exemple.com",
        required: true,
        type: "email"
      },
      phone: {
        label: "Téléphone",
        placeholder: "+33 6 00 00 00 00",
        required: false,
        type: "tel"
      },
      subject: {
        label: "Sujet",
        required: true,
        type: "select",
        options: [
          { value: "", label: "Sélectionnez un sujet" },
          { value: "developpement-web", label: "Développement Web & SaaS" },
          { value: "services-entreprises", label: "Services Entreprises" },
          { value: "conception-3d", label: "Conception 3D" },
          { value: "autre", label: "Autre" }
        ]
      },
      message: {
        label: "Message",
        placeholder: "Décrivez votre projet ou votre question...",
        required: true,
        type: "textarea",
        rows: 5
      }
    },
    submitButton: {
      text: "Envoyer le message",
      loadingText: "Envoi en cours..."
    }
  },
  info: {
    title: "Informations de contact",
    items: [
      {
        type: "email",
        title: "Email",
        content: "contact@cedevium-services.fr",
        action: "mailto:contact@cedevium-services.fr",
        icon: "Mail"
      },
      {
        type: "phone",
        title: "Téléphone",
        content: "+33 6 00 00 00 00",
        action: "tel:+33600000000",
        icon: "Phone"
      },
      {
        type: "location",
        title: "Localisation",
        content: "France",
        action: "#",
        icon: "MapPin"
      }
    ]
  },
  whyChooseUs: {
    title: "Pourquoi nous choisir ?",
    points: [
      "Expertise dans 3 domaines complémentaires",
      "Solutions sur mesure adaptées à vos besoins",
      "Accompagnement de A à Z",
      "Réactivité et professionnalisme"
    ]
  },
  successMessage: {
    title: "Message envoyé avec succès !",
    text: "Nous vous remercions pour votre message. Notre équipe vous répondra dans les plus brefs délais."
  }
};

// Données du composant Header
export const headerData = {
  logo: {
    text: "CS",
    company: "Cedevium Services"
  },
  navigation: [
    { name: 'Accueil', icon: 'Home', href: '#home' },
    { name: 'Services', icon: 'Briefcase', href: '#services' },
    { name: 'Activités', icon: 'Code', href: '#activities' },
    { name: 'Contact', icon: 'Mail', href: '#contact' }
  ]
};

// Données du composant Footer
export const footerData = {
  company: {
    name: "Cedevium Services",
    description: "Votre partenaire de confiance pour le développement web, les services entreprises et la conception 3D.",
    logo: "CS"
  },
  quickLinks: {
    title: "Liens Rapides",
    links: [
      { name: 'Accueil', href: '#home' },
      { name: 'Services', href: '#services' },
      { name: 'Activités', href: '#activities' },
      { name: 'Contact', href: '#contact' }
    ]
  },
  contact: {
    title: "Contact",
    info: [
      { type: "email", content: "contact@cedevium-services.fr", icon: "Mail" },
      { type: "phone", content: "+33 6 00 00 00 00", icon: "Phone" },
      { type: "location", content: "France", icon: "MapPin" }
    ]
  },
  copyright: "© 2024 Cedevium Services. Développé par Cedevium Services"
};

// Configuration du site
export const siteConfig = {
  name: "Cedevium Services",
  description: "Votre partenaire pour le développement web, les services entreprises et la conception 3D",
  url: "https://cedricpages-cninalps.github.io/cedevium-services-app",
  author: "Cedevium Services"
};

export default {
  colors,
  images,
  heroData,
  servicesData,
  activitiesData,
  contactData,
  headerData,
  footerData,
  siteConfig
};
