<script lang="ts">
	import type { IMenuComponentsType } from '$lib/types/types';
	export let selectedMenu: IMenuComponentsType;
	export let menuComponents: IMenuComponentsType[];
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

	<a class="btn  btn-dark-light md:ml-auto" href="/lynx-city-twin/arc" target="_blank" rel="noreferrer">
		<i class="fa-solid fa-map " /><span>High Resolution Map</span>
	</a>
	<form action="/logout" method="POST">
		<button type="submit" class="btn  btn-dark-light">
			<i class="fa-solid fa-right-from-bracket " /><span>Logout</span>
		</button>
	</form>
</div>
