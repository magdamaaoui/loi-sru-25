<script lang="ts">
    import type { Language, NavigationItem } from './types';
    let { routeId, items, language, previousLabel, nextLabel }: {
        routeId: string | null;
        items: NavigationItem[];
        language: Language;
        previousLabel: string;
        nextLabel: string;
    } = $props();

    const currentIndex = $derived(items.findIndex((item) => item.id === routeId));
    const previousRoute = $derived(currentIndex > 0 ? items[currentIndex - 1] : null);
    const nextRoute = $derived(currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : null);
</script>

<nav
	class="mx-auto mt-16 grid w-full max-w-3xl grid-cols-1 gap-3 px-4 py-10 sm:grid-cols-2 sm:px-6"
	aria-label={language === 'fr' ? 'Navigation entre les pages' : 'Page navigation'}
>
	{#if previousRoute}
		<a
			href={previousRoute.href}
			class="border border-gray-300 px-3 py-3 text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900"
		>
			<span class="block text-xs text-gray-500">
				{previousLabel}
			</span>
			{previousRoute.label}
		</a>
	{/if}

	{#if nextRoute}
		<a
			href={nextRoute.href}
			class="border border-gray-300 px-3 py-3 text-right text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 sm:col-start-2"
		>
			<span class="block text-xs text-gray-500">
				{nextLabel}
			</span>
			{nextRoute.label}
		</a>
	{/if}
</nav>
