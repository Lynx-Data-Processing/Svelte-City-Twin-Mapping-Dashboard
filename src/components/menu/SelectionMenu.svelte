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
			class={`btn  ${selectedMenu == menuItem ? 'btn-primary' : 'btn-dark-light'} `}
			on:click={() => (selectedMenu = menuItem)}
			><i class="fa-solid {menuItem.icon} " /><span>{menuItem.title}</span>
		</button>
	{/each}

	<a class="btn  btn-dark-light md:ml-auto" href="/arc" target="_blank" rel="noreferrer">
		<i class="fa-solid fa-map " /><span>High Resolution Map</span></a
	>
</div>
