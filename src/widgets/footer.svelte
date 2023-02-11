<script lang="ts">
	import type { footerElementType } from '../types/types';
	import { getDevicon } from '../utils/icons/devicon-icons';

	const PROGRAMMING_TOOLS = [
		'nextjs',
		'svelte',
		'nodejs',
		'express',
		'nginx',
		'github',
		'docker',
		'googlecloud'
	];

	export const MAIN_LIST: footerElementType[] = [
		{
			id: 0,
			name: 'Animista',
			url: 'https://animista.net/play/basic',
			icon: 'fas fa-palette'
		},

		{
			id: 1,
			name: 'Developer Icons',
			url: 'https://devicon.dev/',
			icon: 'fas fa-code'
		},
		{
			id: 2,
			name: 'Color Designer',
			url: 'https://colordesigner.io/tools',
			icon: 'fas fa-palette'
		}
	];

	export const APPLICATION_LIST: footerElementType[] = [
		{
			id: 0,
			name: 'Animista',
			url: 'https://animista.net/play/basic',
			icon: 'fas fa-palette'
		},

		{
			id: 1,
			name: 'Developer Icons',
			url: 'https://devicon.dev/',
			icon: 'fas fa-code'
		},
		{
			id: 2,
			name: 'Color Designer',
			url: 'https://colordesigner.io/tools',
			icon: 'fas fa-palette'
		},
		{
			id: 3,
			name: 'Font Awesome',
			url: 'https://fontawesome.com/',
			icon: 'fas fa-font'
		},
		{
			id: 4,
			name: 'Cool Backgrounds',
			url: 'https://coolbackgrounds.io/',
			icon: 'fas fa-images'
		},
		{
			id: 5,
			name: 'Gradient Generator',
			url: 'https://cssgradient.io/',
			icon: 'fas fa-palette'
		}
	];

	export const ABOUT_LIST: footerElementType[] = [
		{
			id: 0,
			name: 'About Us',
			url: '#',
			icon: 'fab fa-linkedin'
		},
		{
			id: 1,
			name: 'Our Data',
			url: '#',
			icon: 'fab fa-linkedin'
		}
	];
</script>

<footer class="mt-auto py-8 px-8 md:px-32 lg:px-32">
	<div class="grid grid-cols-1 sm:grid-cols-3 pb-8">
		<div class="col-span-1 py-2">
			<p class="font-bold">GIS Mapping</p>

			{#each MAIN_LIST as item}
				<div class="my-2">
					<a href={`${item.url}`} class="text-sm  hover:underline">{item.name}</a>
				</div>
			{/each}
		</div>

		<div class="col-span-1 py-2">
			<p class="font-bold">Tools</p>
			{#each APPLICATION_LIST as item}
				<div class="my-2">
					<a href={`${item.url}`} class="text-sm  hover:underline">{item.name}</a>
				</div>
			{/each}
		</div>
		<div class="col-span-1 py-2">
			<p class="font-bold">Information</p>
			{#each ABOUT_LIST as item}
				<div class="my-2">
					<a href={`${item.url}`} class="text-sm  hover:underline">{item.name}</a>
				</div>
			{/each}
		</div>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-3 py-8">
		<div class="col-span-1 py-2">
			<p class="font-bold text-2xl"><i class="fa-solid fa-location-arrow" /> LYNX</p>
			<p class="text-sm my-2">
				The City promotes and fosters open government principles of participation, innovation,
				transparency and accountability. The data catalogue supports these principles and is the
				first step in making it easier to view, obtain and use the information the City has
				gathered.
			</p>
		</div>

		<div class="col-span-1 py-2 " />

		<div class="col-span-1 py-2">
			<p class="font-bold">Terms</p>

			<p class="text-sm my-2">
				Application uses MAPBOX to display Geojson data. Interactive, thoroughly customizable maps
				in the browser, powered by vector tiles and WebGL. Mapbox is a location data platform for
				mobile and web applications. We provide building blocks to add location features like maps,
				search, and navigation into any experience you create.
			</p>

			<div class="flex flex-wrap ">
				{#each PROGRAMMING_TOOLS as tool}
					<img
						height="100"
						width="auto"
						title={tool}
						class={`img-icon w-8 mx-2 py-2`}
						alt=""
						src={getDevicon(tool)}
						loading="lazy"
					/>
				{/each}
			</div>
		</div>
	</div>
</footer>
