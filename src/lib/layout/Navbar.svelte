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
			name: 'Open Data Kingston',
			href: 'https://opendatakingston.cityofkingston.ca/pages/welcome/',
			icon: 'fa-solid fa-globe',
			isExternal: true
		}
	];
</script>

<div class="bg-dark navbar flex flex-col ">
	<button title="Lynx" class="bg-dark hover:bg-zinc-800 text-white flex flex-row gap-2 p-4 w-full">
		<i class="fa-solid text-xl fa-location-arrow" aria-hidden="true" />
	</button>

	{#each linkItems as linkItem}
		<a
		title={linkItem.name}
			href={linkItem.href}
			rel="noreferrer"
			target={linkItem.isExternal ? '_blank' : ''}
			class="bg-dark hover:bg-zinc-800 text-white flex flex-row gap-2 p-4 w-full"
		>
			<i class={linkItem.icon} aria-hidden="true" />
		</a>
	{/each}

	<form action="/logout" method="POST" class="mt-auto">
		<button
		  title="Logout"
			type="submit"
			class="bg-dark hover:bg-zinc-800 text-white flex flex-row gap-2 p-4 w-full"
		>
			<i class="fa-solid fa-right-from-bracket " />
		</button>
	</form>
</div>
