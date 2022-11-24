<script>
	export let title = '';
	/**
	 * @type {any}
	 */
	export let selectedMenu;
	/**
	 * @type {any}
	 */
	export let menuComponents;
</script>

<navbar class="shadow-lg z-50">
	<div class={`bg-dark   py-5 px-8 text-white  z-10 flex justify-between`}>
		<div><p class="text-xl  ">{title}</p></div>
		<div><a class="hover:underline" href="https://geojson.io/#map=10.9/44.2456/-76.5014" target="_blank" rel="noreferrer">Create GEOJSON</a></div>
	</div>

	<div class="flex flex-row">
		{#each menuComponents as menuItem}
			<button
				class={`navbar-btn  ${selectedMenu == menuItem.id ? 'btn-primary' : 'btn-default'} `}
				on:click={() => (selectedMenu = menuItem.id)}
				><i class="fa-solid {menuItem.icon} " /> {menuItem.title}
			</button>
		{/each}
	</div>
</navbar>
