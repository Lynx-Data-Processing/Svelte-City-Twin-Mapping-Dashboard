<script lang="ts">
	export let addGeojsonData: Function;
	let value = '';
	let name = '';
	let color = '#e66465';
</script>

<div class="flex flex-col">
	<hr class="my-2" />
	<input class="border w-full my-1 rounded-lg p-2" placeholder="GEOJSON Name" bind:value={name} />

	<p>Data Color:</p>
	<input class="my-1" type="color" id="head" name="head" bind:value={color} />

	<textarea class="border my-1 p-2" placeholder="Add GEOJSON Data" bind:value />

	<hr class="my-2" />

	{#if value !== '' && name !== '' && color !== ''}
		<button
			class={`btn btn-primary my-1`}
			on:click={() => addGeojsonData(value, name, 'Point', color)}
			><i class="fa-solid fa-plus " /> Add Geojson Data
		</button>
	{:else}
		<div class="alert alert-red my-1" role="alert">
			Add a name, select a color, and add GEOJSON Data
		</div>
	{/if}
</div>

<style>
	textarea {
		width: 100%;
		height: 200px;
	}
</style>
