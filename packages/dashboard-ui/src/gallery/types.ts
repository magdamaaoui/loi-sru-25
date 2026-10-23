export type CaptionPosition = `${'top' | 'center' | 'bottom'}-${'left' | 'center' | 'right'}`;

export type GalleryImage = {
    id: string;
    src: string;
    srcset?: string;
    alt: string;
    caption: string;
    captionPosition?: CaptionPosition;
    landscape?: boolean;
    documentation?: boolean;
    objectPosition?: string;
    projectLabel?: string;
    ariaLabel: string;
};
