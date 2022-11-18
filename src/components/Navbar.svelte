<script>
	export let title = "";
	/**
	 * @type {any}
	 */
	 export let selectedMenu;
	/**
	 * @type {any}
	 */
	 export let menuComponents;

</script>

<navbar class="shadow-xl  z-50">
	<div class={`bg-dark   py-5 px-4 text-white  z-10`}>
		<p class="text-xl  ">{title}</p>
	</div>

	<div class="flex flex-row">
		{#each menuComponents as menuItem}
			<button class={` navbar-btn ${selectedMenu == menuItem.id ? "btn-primary" : ""} `} on:click={() => (selectedMenu = menuItem.id)}
				><i class="fa-solid {menuItem.icon} " /> {menuItem.title}
			</button>
		{/each}
	</div>
</navbar>
