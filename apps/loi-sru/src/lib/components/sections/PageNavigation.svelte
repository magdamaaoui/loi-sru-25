<script lang="ts">
    import { resolve } from '$app/paths';
    import PageNavigation from '@dashboards/ui/navigation/PageNavigation.svelte';
    import { siteRoutes } from '$lib/data/routes';
    import type { SiteSettingsContent } from '$lib/data/site-content';
    import { language } from '$lib/i18n';

    let { routeId, settings }: { routeId: string | null; settings: SiteSettingsContent } = $props();
    const items = $derived(siteRoutes.map(({ href }) => ({
        id: href, href: resolve(href), label: settings.navigation[$language][href]
    })));
</script>

<PageNavigation {routeId} {items} language={$language} previousLabel={settings.previousPage[$language]} nextLabel={settings.nextPage[$language]} />
