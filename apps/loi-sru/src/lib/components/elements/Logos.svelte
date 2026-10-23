<script lang="ts">
	import { asset } from '$app/paths';
	import LogoStrip from '@dashboards/ui/logos/LogoStrip.svelte';

	const logos: { src: string; alt: string; href: string }[] = [
		{ src: asset('/logos/gsd.svg'), alt: 'Harvard GSD', href: 'https://www.gsd.harvard.edu/' },
		{ src: asset('/logos/healthy-places-gsd.png'), alt: 'Healthy Places Design Lab', href: 'https://research.gsd.harvard.edu/healthy/' },
		{ src: asset('/logos/harvard_university.svg'), alt: 'Harvard University', href: 'https://www.harvard.edu/' },
		{ src: asset('/logos/hdsi.png'), alt: 'Harvard Data Science Initiative', href: 'https://datascience.harvard.edu/' },
		{ src: asset('/logos/mellon_urban_initiative.png'), alt: 'Harvard Mellon Urban Initiative', href: 'https://mellonurbanism.harvard.edu/' },
		{ src: asset('/logos/hcjs.svg'), alt: 'Harvard Joint Center for Housing Studies', href: 'https://www.jchs.harvard.edu/' },
		{ src: asset('/logos/mtel.jpg'), alt: 'French Ministry of Housing', href: 'https://www.ecologie.gouv.fr/' }
	];
</script>

<LogoStrip {logos} />
