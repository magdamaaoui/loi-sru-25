<script lang="ts">
	import { createLogoSoup } from '@sanity-labs/logo-soup/svelte';
	import { getVisualCenterTransform } from '@sanity-labs/logo-soup';

    let { logos }: { logos: { src: string; alt: string; href: string; filter?: string }[] } = $props();

	const logoLinks = $derived(new Map(logos.map((logo) => [logo.src, logo])));

	const soup = createLogoSoup();

	$effect(() => {
		soup.process({ logos, baseSize: 60, scaleFactor: 0.5 });
	});

	$effect(() => {
		return () => soup.destroy();
	});
</script>

{#if soup.isReady}
	<div class="mt-3 flex w-full max-w-6xl mx-auto flex-col items-center gap-y-4 px-6 md:flex-row md:flex-nowrap md:justify-between md:gap-x-4 md:gap-y-0">
		{#each soup.normalizedLogos as logo, i (logo.src + i)}
				<a
					href={logoLinks.get(logo.src)?.href}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block rounded-[var(--dashboard-logo-radius,0.125rem)] p-1 align-middle transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dashboard-accent)]"
					style:opacity={soup.isLoading ? 0 : 1}
					style:transition="opacity 0.2s ease-in-out"
				>
					<img
						src={logo.croppedSrc || logo.src}
						alt={logo.alt}
						width={logo.normalizedWidth}
						height={logo.normalizedHeight}
						style:filter={logoLinks.get(logo.src)?.filter}
						style:display="block"
						style:object-fit="contain"
						style:width="{logo.normalizedWidth}px"
						style:height="{logo.normalizedHeight}px"
						style:transform={getVisualCenterTransform(logo, 'visual-center-y')}
					/>
				</a>
		{/each}
	</div>
{/if}
