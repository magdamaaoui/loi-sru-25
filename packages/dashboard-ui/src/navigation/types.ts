export type Language = 'fr' | 'en';

/** Apps resolve their own URLs and translations before passing navigation items. */
export type NavigationItem = {
    id: string;
    href: string;
    label: string;
};
