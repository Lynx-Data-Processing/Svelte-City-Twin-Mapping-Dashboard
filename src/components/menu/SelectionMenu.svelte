<script lang="ts">
	import type { menuComponentsType } from '../../types/types';
	export let selectedMenu: menuComponentsType;
	export let menuComponents: menuComponentsType[];
</script>

<div class="flex flex-col md:flex-row  lg:flex-row bg-smoke  py-4 px-4 gap-4">
	{#each menuComponents as menuItem}
		<button
			class={`btn  ${selectedMenu.id == menuItem.id ? 'btn-primary' : 'btn-black-outline'} `}
			on:click={() => (selectedMenu = menuItem)}
			><i class="fa-solid {menuItem.icon} " /> {menuItem.title}
		</button>
	{/each}

	<a
		class="btn  btn-black-outline md:ml-auto"
		href="https://geojson.io/#map=10.9/44.2456/-76.5014"
		target="_blank"
		rel="noreferrer"
	>
		<i class="fa-solid fa-map " />Create GEOJSON</a
	>
</div>
