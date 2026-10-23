<script lang="ts">
    import { asset } from '$app/paths';
    import { language } from '$lib/i18n';
    import { siteTitle, subtitle } from '$lib/site';
    import LogoStrip from '@dashboards/ui/logos/LogoStrip.svelte';

    const supporters = [
        { src: asset('/logos/gsd.svg'), alt: 'Harvard Graduate School of Design', href: 'https://www.gsd.harvard.edu/' },
        { src: asset('/logos/healthy-places-gsd.png'), alt: 'Healthy Places Design Lab', href: 'https://research.gsd.harvard.edu/healthy/' },
        { src: asset('/logos/harvard-cgbc.png'), alt: 'Harvard Center for Green Buildings and Cities', href: 'https://harvardcgbc.org/', filter: 'brightness(0)' },
        { src: asset('/logos/collectif-dernier-etage.png'), alt: 'Collectif Dernier Étage', href: 'https://www.collectifdernieretage.com/', filter: 'brightness(0)' }
    ];

    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    const headings = {
        supported: { en: 'Supported by', fr: 'Avec le soutien de' },
        chronology: { en: 'Heatwaves and policy responses', fr: 'Canicules et réponses politiques' },
        inaction: { en: 'The cost of inaction', fr: 'Le coût de l’inaction' },
        acknowledgements: { en: 'Acknowledgements', fr: 'Remerciements' }
    };
    const introductionSections = [
        { id: 'why-now', title: { en: 'Why this dashboard, and why now?', fr: 'Pourquoi ce tableau de bord, et pourquoi maintenant ?' } },
        { id: 'heatwaves', title: { en: 'Years of heatwaves: achievements and blind spots', fr: 'Des années de canicules : avancées et angles morts' } },
        { id: 'using-the-dashboard', title: { en: 'Using the dashboard', fr: 'Utiliser le tableau de bord' } }
    ];
    const acknowledgements = [
        { id: 'data-access', title: { en: 'Data access', fr: 'Accès aux données' } },
        { id: 'conversations', title: { en: 'Conversations that informed this project', fr: 'Les échanges qui ont nourri ce projet' } },
        { id: 'photography', title: { en: 'Photography', fr: 'Photographie' } },
        { id: 'research-team', title: { en: 'Research assistantship team', fr: 'Équipe d’assistance à la recherche' } }
    ];
</script>

<svelte:head>
    <link rel="preload" as="image" href={asset('/images/parisian-spiral-stair.jpg')} fetchpriority="high" />
</svelte:head>

<section class="intro-hero" aria-labelledby="intro-title">
    <img
        class="intro-hero__image"
        src={asset('/images/parisian-spiral-stair.jpg')}
        alt={$language === 'fr' ? 'Vue vers le haut d’un escalier en colimaçon parisien' : 'Looking up through a Parisian spiral staircase'}
        width="761"
        height="769"
        loading="eager"
        decoding="async"
        fetchpriority="high"
    />
    <div class="intro-hero__tint" aria-hidden="true"></div>
    <div class="intro-hero__grain" aria-hidden="true"></div>
    <div class="intro-hero__shade" aria-hidden="true"></div>
    <div class="intro-hero__content">
        <h1 id="intro-title" class:intro-title--fr={$language === 'fr'}>{siteTitle[$language]}</h1>
        <p class="intro-hero__subtitle">{subtitle[$language]}</p>
        <p class="intro-hero__byline">Magda Maaoui</p>
        <div class="intro-hero__copy">
            <p>{lorem}</p>
            <p>{lorem} Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            <p>{lorem} Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>{lorem}</p>
            <p>{lorem} Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>{lorem} Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. {lorem}</p>
        </div>
    </div>
</section>

<figure class="building-section">
    <img
        src={asset('/images/haussmann-section.webp')}
        alt={$language === 'fr' ? 'Coupe d’un immeuble haussmannien, dessinée en bleu avec des ombres tramées' : 'Section through a Haussmann building, drawn in blue with halftone shading'}
        width="1700"
        height="2200"
        loading="lazy"
        decoding="async"
    />
</figure>

<section class="support-section" aria-labelledby="supported-by">
    <div class="max-w-6xl mx-auto px-6 pb-4">
        <h2 id="supported-by" class="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">
            {headings.supported[$language]}
        </h2>
    </div>
    <LogoStrip logos={supporters} />
</section>

<section class="introduction">
    <div class="prose-column">
        <section class="section-copy" aria-labelledby="chronology">
            <h2 id="chronology" class="section-title">{headings.chronology[$language]}</h2>
        </section>

        <section class="section-copy" aria-labelledby="cost-of-inaction">
            <h2 id="cost-of-inaction" class="section-title">{headings.inaction[$language]}</h2>
        </section>

        {#each introductionSections as section (section.id)}
            <section class="section-copy" aria-labelledby={section.id}>
                <h2 id={section.id} class="section-title">{section.title[$language]}</h2>
                <p class="section-body">{lorem}</p>
            </section>
        {/each}

        <section class="section-copy" aria-labelledby="acknowledgements">
            <h2 id="acknowledgements" class="section-title">{headings.acknowledgements[$language]}</h2>
            {#each acknowledgements as credit (credit.id)}
                <section class="credit" aria-labelledby={credit.id}>
                    <h3 id={credit.id}>{credit.title[$language]}</h3>
                    <p class="section-body">{lorem}</p>
                </section>
            {/each}
        </section>
    </div>
</section>

<style>
    .introduction {
        padding-bottom: var(--space-xl);
    }

    .intro-hero {
        position: relative;
        isolation: isolate;
        color: white;
    }

    .intro-hero__image,
    .intro-hero__tint,
    .intro-hero__grain,
    .intro-hero__shade {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    }

    .intro-hero__image {
        object-fit: cover;
        object-position: center;
        filter: grayscale(1) contrast(1.12);
    }

    .intro-hero__tint {
        background: var(--dashboard-accent);
        mix-blend-mode: color;
        opacity: 0.3;
    }

    .intro-hero__grain {
        background-image: url("data:image/svg+xml,%3Csvg width='512' height='512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain' x='0' y='0' width='100%25' height='100%25' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' seed='17' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cpath fill='%23808080' filter='url(%23grain)' d='M0 0h512v512H0z'/%3E%3C/svg%3E");
        background-size: 512px 512px;
        mix-blend-mode: soft-light;
        opacity: 0.5;
    }

    .intro-hero__shade {
        background: linear-gradient(to bottom, rgb(10 12 48 / 45%), rgb(10 12 48 / 50%), rgb(5 6 28 / 80%));
    }

    .building-section {
        width: min(100%, 56rem);
        margin: 0 auto;
        padding: var(--space-xl) var(--page-gutter);
    }

    .building-section img {
        display: block;
        width: 100%;
        height: auto;
    }

    .intro-hero__content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        min-height: 100vh;
        max-width: 64rem;
        margin-inline: auto;
        padding: 6rem 1.5rem 4rem;
        text-align: center;
    }

    h1 {
        width: 100%;
        max-width: 30ch;
        margin: 0 auto;
        padding-top: clamp(1.5rem, 4vw, 3.5rem);
        font-size: clamp(1.75rem, 5.6vw, 4.5rem);
        font-weight: 500;
        letter-spacing: -0.025em;
        line-height: 1.05;
    }

    h1.intro-title--fr {
        max-width: 18ch;
        font-size: clamp(2.25rem, 7vw, 6rem);
    }

    .intro-hero__subtitle {
        margin-top: 0.75rem;
        color: rgb(255 255 255 / 80%);
        font-size: 1.125rem;
        line-height: 1.75rem;
    }

    .intro-hero__byline {
        margin-top: 1rem;
        color: rgb(255 255 255 / 80%);
        font-size: 1rem;
        line-height: 1.5;
    }

    .intro-hero__copy {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 42rem;
        margin-top: 1.5rem;
        color: rgb(255 255 255 / 90%);
        font-size: 0.875rem;
        line-height: 1.625;
    }

    @media (min-width: 768px) {
        .intro-hero__subtitle {
            font-size: 1.25rem;
        }

        .intro-hero__copy {
            font-size: 1rem;
        }
    }

    .credit {
        margin-top: var(--space-lg);
    }

    .credit h3 {
        margin: 0;
        color: var(--editorial-ink);
        font-size: 1.25rem;
        font-weight: 700;
        line-height: 1.3;
    }
</style>
