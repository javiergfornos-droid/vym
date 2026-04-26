export type Language = 'es' | 'en';

export const labels = {
  es: {
    brand: 'VYM',
    subtitle: 'Vector Your Model',
    nav: {
      how: 'Cómo funciona',
      what: 'Qué hacemos',
      who: 'Quiénes somos',
      contact: 'Contacto',
    },
    cta: 'Valora tu empresa',
    heroTitle: 'Valoración financiera con rigor editorial.',
    heroBody:
      'VYM traduce la disciplina de una boutique de advisory en una experiencia guiada, calma y precisa para valorar tu empresa.',
    heroKicker: 'Plataforma premium de valoración',
    sections: {
      benefits: 'Beneficios',
      how: 'Cómo funciona',
      products: 'Productos premium',
    },
    footer: 'Diseñado para decisiones serias de creación de valor.',
    wizard: {
      doubts: 'Dudas',
      back: 'Atrás',
      next: 'Siguiente',
      progress: 'Progreso',
      stepLabel: 'Paso',
    },
  },
  en: {
    brand: 'VYM',
    subtitle: 'Vector Your Model',
    nav: {
      how: 'How it works',
      what: 'What we do',
      who: 'Who we are',
      contact: 'Contact',
    },
    cta: 'Value your company',
    heroTitle: 'Financial valuation with editorial rigor.',
    heroBody:
      'VYM translates boutique advisory discipline into a guided, calm, and precise experience to value your company.',
    heroKicker: 'Premium valuation platform',
    sections: {
      benefits: 'Benefits',
      how: 'How it works',
      products: 'Premium products',
    },
    footer: 'Designed for serious value-creation decisions.',
    wizard: {
      doubts: 'Questions',
      back: 'Back',
      next: 'Next',
      progress: 'Progress',
      stepLabel: 'Step',
    },
  },
} as const;

export const getLanguage = (raw?: string | null): Language =>
  raw === 'en' ? 'en' : 'es';
