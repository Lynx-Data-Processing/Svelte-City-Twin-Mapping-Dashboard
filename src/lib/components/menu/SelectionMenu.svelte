<script lang="ts">
	import type { IMenuComponentsType } from '$lib/types/types';
	export let selectedMenu: IMenuComponentsType;
	export let components: IMenuComponentsType[];

	let isMenuOpen: boolean = true;
	const toggleMenu = () => (isMenuOpen = !isMenuOpen);
</script>

<div class="bg-dark flex flex-col 2xl:flex-row bg-smoke px-2  sticky top-0 z-50 shadow-md">
	{#if isMenuOpen}
		<button class="visible 2xl:hidden btn  btn-dark-light " on:click={toggleMenu}>
			<i class="fa-solid fa-bars " /><span>Hide Menu</span>
		</button>
		<hr class="visible 2xl:hidden border-gray-300 my-2" />

		{#each components as menuComponent}
			{#if menuComponent.url}
				<a class="btn  btn-dark-light " href={menuComponent.url} target="_blank" rel="noreferrer">
					<i class="fa-solid {menuComponent.icon} " /><span>{menuComponent.title}</span>
				</a>
			{:else}
				<button
					class={`btn  ${selectedMenu == menuComponent ? 'btn-primary' : 'btn-dark-light'} `}
					on:click={() => (selectedMenu = menuComponent)}
					><i class="fa-solid {menuComponent.icon} " /><span>{menuComponent.title}</span>
				</button>
			{/if}
		{/each}

		<hr class="visible 2xl:hidden border-gray-300 my-2" />
		<form action="/logout" method="POST" class="btn  btn-dark-light  2xl:ml-auto">
			<button type="submit" class="">
				<i class="fa-solid fa-right-from-bracket " /><span>Logout</span>
			</button>
		</form>
	{:else}
		<button class=" btn  btn-dark-light " on:click={toggleMenu}>
			<i class="fa-solid fa-bars" /><span>Open Menu</span>
		</button>
	{/if}
</div>
