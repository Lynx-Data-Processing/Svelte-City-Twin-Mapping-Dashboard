<script lang="ts">
	import type { IMapLayer } from '../../types';

	export let layer: IMapLayer;
	export let toggleLayer: Function;
	export let handleToggleLayerMenu: Function;
</script>

<div class="flex flex-row h-10">
	<p class="my-auto ml-4">{layer.layerName}</p>
	<button class="ml-auto p-2 w-10" title={layer.layerName} on:click={() => toggleLayer(layer)}>
		<i class="{layer.isVisible ? 'fas fa-eye' : 'fas fa-eye-slash'} m-auto" />
	</button>

	<button
		class="p-2 w-10 bg-dark text-white"
		title={layer.layerName}
		on:click={() => {
			handleToggleLayerMenu(layer);
		}}
	>
		<i class="fa-solid fa-ellipsis m-auto" />
	</button>
</div>
