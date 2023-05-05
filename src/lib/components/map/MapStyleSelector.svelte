<script lang="ts">
	import type { IMapStyle } from '$lib/types/mapTypes';
	
	export let selectedMapStyle: IMapStyle
	export let mapStyles: IMapStyle[]
	export let switchStyle: Function

</script>

<div class="flex flex-col">
	{#each mapStyles as mapStyle}
		<div>
			<input
				value={mapStyle.value}
				type="radio"
				checked={selectedMapStyle === mapStyle}
				on:click={() => switchStyle(mapStyle)}
				name={mapStyle.name}
				id={mapStyle.name}
			/>
			<label class="ml-2" for={mapStyle.name}>{mapStyle.name}</label>
		</div>
	{/each}
</div>


