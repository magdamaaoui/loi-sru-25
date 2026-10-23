<script lang="ts">
    import { onMount, type Snippet } from 'svelte';
    import type { GalleryImage } from './types';
    import './photo-gallery.css';

    let {
        images,
        activeFrame,
        container = $bindable(null),
        elements = $bindable([]),
        overlay
    }: {
        images: GalleryImage[];
        // A multi-project page can control the active frame and bind elements for jumping.
        activeFrame?: number;
        container?: HTMLDivElement | null;
        elements?: HTMLElement[];
        overlay?: Snippet<[GalleryImage, number]>;
    } = $props();

    let scrollFrame = $state(0);
    const currentFrame = $derived(activeFrame ?? scrollFrame);

    onMount(() => {
        let pending = 0;
        function update() {
            pending = 0;
            if (activeFrame !== undefined) return;
            const focusLine = window.innerHeight * 0.52;
            let next = 0;
            for (let index = 0; index < images.length; index += 1) {
                if (elements[index]?.getBoundingClientRect().top <= focusLine) next = index;
                else break;
            }
            scrollFrame = next;
        }
        function schedule() {
            if (activeFrame === undefined && !pending) pending = requestAnimationFrame(update);
        }
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        update();
        return () => {
            cancelAnimationFrame(pending);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
        };
    });
</script>

<div bind:this={container} class="story-cards">
    {#each images as image, index (image.id)}
        <article
            bind:this={elements[index]}
            data-frame={index}
            data-project={image.projectLabel}
            class="story-card"
            class:story-card--documentation={image.documentation}
            class:story-card--landscape={image.landscape}
            class:story-card--last={index === images.length - 1}
            class:story-card--retired={index < currentFrame - 2}
            style:z-index={index + 1}
            aria-label={image.ariaLabel}
        >
            <img
                src={image.src}
                srcset={image.srcset}
                sizes={image.srcset ? '100vw' : undefined}
                alt={image.alt}
                class="story-image"
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                style:object-position={image.objectPosition}
            />
            {#if overlay}
                {@render overlay(image, index)}
            {:else if image.caption}
                <p class="story-caption story-caption--{image.captionPosition ?? 'top-right'}">{image.caption}</p>
            {/if}
        </article>
    {/each}
</div>
