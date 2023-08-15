<script lang="ts">
	import { LOGOUT, USARS_GIS } from '$lib/constants/strings';
	import type { INavbarElement } from '$lib/types/types';
	const linkItems: INavbarElement[] = [
		{
			id: 2,
			name: 'Create Data',
			href: 'http://geojson.io/#map=12.55/44.23998/-76.52345',
			icon: 'fa-solid  fa-layer-group',
			isExternal: true
		},
		{
			id: 3, 
			name: "Open Data Kingston",
			href: "https://opendatakingston.cityofkingston.ca/pages/welcome/",
			icon: "fa-solid fa-globe",
			isExternal: true
		}
	];
</script>

<div class="bg-dark navbar flex flex-col ">
	<button class="btn btn-selected btn-no-border w-full flex flex-row gap-2  ">
		<i class="fa-solid text-xl fa-location-arrow" aria-hidden="true" />
		<p class="my-auto">{USARS_GIS}</p>
	</button>

	{#each linkItems as linkItem, i}
		<a
			href={linkItem.href}
			rel="noreferrer"
			target={linkItem.isExternal ? '_blank' : ''}
			class="btn btn-no-border w-full flex flex-row gap-2  "
		>
			<i class={linkItem.icon} aria-hidden="true" />
			<p class="my-auto">{linkItem.name}</p>
		</a>
	{/each}

	<form action="/logout" method="POST" class="mt-auto">
		<button type="submit" class="btn  w-full flex flex-row gap-2 p-4">
			<i class="fa-solid fa-right-from-bracket " />
			<p>{LOGOUT}</p>
		</button>
	</form>
</div>
