<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { FontAwesomeIconGivenGeojsonEnum } from '../../types/enums';
	import type { layerListElementType } from '../../types/types';

	export let updateMapCenter: Function;
	export let layerList: layerListElementType[] = [];
	let visibleLayers: layerListElementType[] = layerList;
	let searchText: String = '';

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

			filterLayersBySearch();
		} catch (e) {}
	};
	const toggleLayer = (selectedLayer: layerListElementType) => {
		try {
			// Get the object from the list and toggle the is shown
			let tempCollection = layerList;
			let index = tempCollection.findIndex((layer) => layer.layerName === selectedLayer.layerName);
			tempCollection[index].isShown = !tempCollection[index].isShown;
			layerList = tempCollection;
			if (checkIfAllLayersAreSame() === true) {
				showAllLayers = !tempCollection[index].isShown;
			}

			filterLayersBySearch();
		} catch (e) {
			console.log(e);
		}
	};
	const checkIfAllLayersAreSame = () => {
		let initialIsShown = layerList[0].isShown;
		return layerList.every((element) => element.isShown === initialIsShown);
	};

	const filterLayersBySearch = () => {
		try {
			let tempCollection = layerList;
			const tempSearch = searchText
				.trim()
				.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
				.replace(' ', '');
			var expr = new RegExp(tempSearch, 'gi');
			if (tempSearch === '') {
				visibleLayers = tempCollection;
			} else {
				visibleLayers = tempCollection.filter((layer) => {
					return expr.test(layer.layerName);
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	const clearSearch = () => {
		searchText = '';
		filterLayersBySearch();
	};

	$: layerList && filterLayersBySearch();
</script>

<div class="flex flex-col">
	{#if layerList.length}
		<button
			on:click={toggleLayers}
			class={`btn   ${showAllLayers ? 'btn-primary' : 'btn-error-outline'}  my-1 `}
		>
			{showAllLayers ? 'Show All' : 'Disable All'}
		</button>

		<div class="my-1 flex flex-row gap-4">
			<label for="default-search" class=" font-medium sr-only ">Search</label>
			<div class="h-full w-full relative ">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<svg
						aria-hidden="true"
						class="w-5 h-5 "
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/></svg
					>
				</div>
				<input
					on:change={filterLayersBySearch}
					type="search"
					id="default-search"
					class="block w-full p-4 pl-10  border   focus:ring-blue-500 focus:border-blue-500  "
					placeholder="Search Layers"
					bind:value={searchText}
					required
				/>
			</div>

			<button on:click={clearSearch} class="btn btn-black-outline w-16 btn-text-center"
				><i class="fa-solid fa-trash " /></button
			>
		</div>

		<div class="flex flex-col ">
			{#each visibleLayers as layer}
				<div class="flex flex-row gap-4  my-1">
					<button
						on:click={() => toggleLayer(layer)}
						class={`btn w-full ${layer.isShown ? 'btn-primary' : 'btn-black-outline'} `}
					>
						<i class="fa-solid {layer.icon} " />
						<span>{layer.layerName}</span>
					</button>

					<button
						on:click={() => {
							updateMapCenter(layer.initialCoordinates);
						}}
						class="btn btn-black-outline w-16 btn-text-center"
						><i
							class={`${FontAwesomeIconGivenGeojsonEnum[layer.type]} icon-color`}
							style={`--sent-color: ${layer.color}`}
						/></button
					>
				</div>
			{/each}
		</div>
	{:else}
		<div class="alert alert-green my-1" role="alert">Loading Data.</div>
	{/if}
</div>
