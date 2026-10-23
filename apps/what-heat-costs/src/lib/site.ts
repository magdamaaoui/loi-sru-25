import type { Language } from './i18n';

type Localized = Record<Language, string>;
export const siteTitle: Localized = {
    en: 'What Heat Costs',
    fr: 'Le coût de la chaleur'
};

// Working subtitle selected from the supplied sketch; no research content yet.
export const subtitle: Localized = {
    en: 'From exposure to preparedness',
    fr: 'De l’exposition à la préparation'
};

export const sections = [
    { href: '/', label: { en: 'Introduction', fr: 'Introduction' } },
    { href: '/numbers', label: { en: 'The Numbers', fr: 'Chiffres' } },
    { href: '/health-outcomes', label: { en: 'Health Outcomes', fr: 'Indicateurs de santé' } },
    { href: '/preparedness-evaluation', label: { en: 'Preparedness Evaluation', fr: 'Évaluation de la préparation' } },
    { href: '/resources', label: { en: 'News Sources', fr: 'Revue de presse' } },
    { href: '/bibliography', label: { en: 'Bibliography', fr: 'Bibliographie' } }
] as const;

export function sectionTitle(href: string, language: Language): string {
    return sections.find((section) => section.href === href)?.label[language] ?? siteTitle[language];
}
