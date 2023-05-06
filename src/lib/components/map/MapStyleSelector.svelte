<script lang="ts">
	import type { IMapStyle } from '$lib/types/mapTypes';
	
	export let selectedMapStyle: IMapStyle
	export let mapStyles: IMapStyle[]
	export let switchStyle: Function

</script>

<div class="flex flex-col ">
	{#each mapStyles as mapStyle}
		<button on:click={() => switchStyle(mapStyle)} class="flex flex-row  my-1 border  {selectedMapStyle === mapStyle ? 'btn-primary' : 'btn-black-outline'}">
			<img alt={mapStyle.id} src={mapStyle.image}  class="w-14 h-14 " />
			
			<p class="mx-2 my-auto "  for={mapStyle.name}>{mapStyle.name}</p>
		</button>
	{/each}
</div>


