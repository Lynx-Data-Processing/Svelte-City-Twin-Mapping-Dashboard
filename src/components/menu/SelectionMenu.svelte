<script lang="ts">
	import type { menuComponentsType } from '../../types/types';
	export let selectedMenu: menuComponentsType;
	export let menuComponents: menuComponentsType[];
</script>

<div
	class="bg-dark flex flex-col md:flex-row  lg:flex-row bg-smoke px-2  sticky top-0 z-50 shadow-md"
>
	{#each menuComponents as menuItem}
		<button
			class={`btn  ${selectedMenu.id == menuItem.id ? 'btn-primary' : 'btn-dark-light'} `}
			on:click={() => (selectedMenu = menuItem)}
			><i class="fa-solid {menuItem.icon} " /><span>{menuItem.title}</span>
		</button>
	{/each}

	<a
		class="btn  btn-dark-light md:ml-auto"
		href="https://geojson.io/#map=10.9/44.2456/-76.5014"
		target="_blank"
		rel="noreferrer"
	>
		<i class="fa-solid fa-map " /><span>Create GEOJSON</span></a
	>
</div>
