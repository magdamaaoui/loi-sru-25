<script lang="ts">
    import { asset } from '$app/paths';
    import PhotoGallery from '@dashboards/ui/gallery/PhotoGallery.svelte';
    import { language } from '$lib/i18n';
    import { sectionTitle } from '$lib/site';
    import { preparednessPhotos } from '$lib/data/preparedness-photos';

    const images = $derived(preparednessPhotos.map((photo, index) => ({
        id: photo.id,
        src: asset(`/images/preparedness/${photo.id}-2200.webp`),
        srcset: `${asset(`/images/preparedness/${photo.id}-960.webp`)} 960w, ${asset(`/images/preparedness/${photo.id}-2200.webp`)} 2200w`,
        alt: photo.alt[$language],
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        captionPosition: 'top-right' as const,
        landscape: true,
        ariaLabel: $language === 'fr'
            ? `Photographie ${index + 1} sur ${preparednessPhotos.length}`
            : `Photograph ${index + 1} of ${preparednessPhotos.length}`
    })));
</script>

<section class="page-shell">
    <div class="prose-column">
        <h1 class="page-title">{sectionTitle('/preparedness-evaluation', $language)}</h1>
    </div>
</section>

<section class="preparedness-gallery" aria-label={$language === 'fr' ? 'Photographies du chantier' : 'Construction photographs'}>
    <PhotoGallery {images} />
</section>

<style>
    .preparedness-gallery {
        --gallery-bottom-clearance: 0rem;
        margin-top: var(--space-lg);
        position: relative;
        overflow: clip;
        background: #111;
    }

    @media (max-width: 639.98px) {
        .preparedness-gallery {
            --gallery-top: 3.5rem;
        }
    }
</style>
