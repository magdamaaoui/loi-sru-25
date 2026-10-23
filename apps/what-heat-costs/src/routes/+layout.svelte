<script lang="ts">
    import './layout.css';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import DashboardNavigation from '@dashboards/ui/navigation/DashboardNavigation.svelte';
    import PageNavigation from '@dashboards/ui/navigation/PageNavigation.svelte';
    import { initializeLanguage, language, setLanguage } from '$lib/i18n';
    import { sections, siteTitle, sectionTitle } from '$lib/site';

    let { children } = $props();
    onMount(initializeLanguage);
    const items = $derived(sections.map(({ href, label }) => ({
        id: href, href: resolve(href), label: label[$language]
    })));
    const title = $derived(page.route.id === '/' ? siteTitle[$language] : `${sectionTitle(page.route.id ?? '', $language)} · ${siteTitle[$language]}`);
</script>

<svelte:head>
    <meta name="theme-color" content="#ffffff" />
    <title>{title}</title>
</svelte:head>

<div class="flex min-h-screen flex-col" lang={$language}>
    <a class="skip-link" href="#main-content">{$language === 'fr' ? 'Aller au contenu principal' : 'Skip to main content'}</a>
    <DashboardNavigation routeId={page.route.id} {items} language={$language} onLanguageChange={setLanguage} overlayHero={page.route.id === '/'} />
    <main id="main-content" class="flex flex-1 flex-col" tabindex="-1">
        <div class="flex-1">{@render children()}</div>
        <PageNavigation routeId={page.route.id} {items} language={$language} previousLabel={$language === 'fr' ? 'Page précédente' : 'Previous page'} nextLabel={$language === 'fr' ? 'Page suivante' : 'Next page'} />
    </main>
</div>
