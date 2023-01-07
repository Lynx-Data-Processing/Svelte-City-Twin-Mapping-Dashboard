<script lang="ts">
	import type { layerLisElementType } from '../../types/types';

	export let layerList: layerLisElementType[] = [];
	let showAllLayers = false;
	const toggleLayers = () => {
		try {
			//Change all the isShow values to true or false
			let tempCollection = layerList;
			tempCollection.map((layer) => {
				layer.isShown = showAllLayers;
				return layer;
			});
			layerList = tempCollection;
			showAllLayers = !showAllLayers;
		} catch (e) {}
	};
	const toggleLayer = (selectedLayer: layerLisElementType) => {
		try {
			// Get the object from the list and toggle the is shown
			let tempCollection = layerList;
			let index = tempCollection.findIndex((layer) => layer.layerName === selectedLayer.layerName);
			tempCollection[index].isShown = !tempCollection[index].isShown;
			layerList = tempCollection;
			if (checkIfAllLayersAreSame() === true) {
				showAllLayers = !tempCollection[index].isShown;
			}
		} catch (e) {
			console.log(e);
		}
	};
	const checkIfAllLayersAreSame = () => {
		let initialIsShown = layerList[0].isShown;
		return layerList.every((element) => element.isShown === initialIsShown);
	};
</script>

<div class="flex flex-col">
	{#if layerList.length}
		<button
			on:click={toggleLayers}
			class={`btn   ${showAllLayers ? 'btn-green' : 'btn-error-outline'}  my-1 `}
		>
			{showAllLayers ? 'Show All' : 'Disable All'}
		</button>
		<div class="flex flex-col ">
			{#each layerList as layer}
				<button
					on:click={() => toggleLayer(layer)}
					class={`btn  ${layer.isShown ? 'btn-primary' : 'btn-black-outline'} my-1 `}
				>
					<i class="fa-solid {layer.icon} " />
					{layer.layerName}
				</button>
			{/each}
		</div>
	{:else}
		<div class="alert alert-green my-1" role="alert">Loading Data.</div>
	{/if}
</div>
