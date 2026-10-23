<script lang="ts">
    import { resolve } from '$app/paths';
    import DashboardNavigation from '@dashboards/ui/navigation/DashboardNavigation.svelte';
    import { siteRoutes } from '$lib/data/routes';
    import Glossary from './Glossary.svelte';
    import type { SiteSettingsContent } from '$lib/data/site-content';
    import { language, setLanguage } from '$lib/i18n';

    let { routeId, settings }: { routeId: string | null; settings: SiteSettingsContent } = $props();
    const items = $derived(siteRoutes.map(({ href }) => ({
        id: href, href: resolve(href), label: settings.navigation[$language][href]
    })));
</script>

<DashboardNavigation {routeId} {items} language={$language} onLanguageChange={setLanguage} overlayHero={routeId === '/'}>
    {#snippet glossary()}<Glossary content={settings.glossary[$language]} />{/snippet}
</DashboardNavigation>
