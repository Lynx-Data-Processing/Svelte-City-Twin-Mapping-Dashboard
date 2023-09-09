<script lang="ts">
	import { addAdditionalStylingToGeojson } from '../helpers/geojson/geojson-utils';
	import { createMapLayer } from '../helpers/google/google-map-utils';
	import type { GeojsonGeometryType } from '../types';

	let isSuccessful = false;
	let showStatus = false;
	let layerName: string = '';
	let layerColor: string = '#ffffff';
	let geometryType: string = 'Point';
	let geojson: any = null;

	export let processMapLayers: Function;

	function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				try {
					geojson = JSON.parse(e.target!.result as string);
				} catch (error) {
					console.error('Invalid GeoJSON format:', error);
				}
			};
			reader.readAsText(file);
		}
	}

	function processLayer() {
		if (geojson && layerName && layerColor && geometryType) {
			geojson = addAdditionalStylingToGeojson(geojson, layerColor, false);
			processMapLayers([
				createMapLayer(
					layerName,
					geometryType as GeojsonGeometryType,
					true,
					'fa-solid fa-map',
					layerColor,
					geojson
				)
			]);
			isSuccessful = true;
		} else {
			isSuccessful = false;
		}

		showStatus = true;
		setTimeout(() => (showStatus = false), 3000);
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<!-- Layer Name Input -->
	<label class="flex flex-col font-bold">
		<span class="font-bold mb-2">Layer Name</span>
		<input
			bind:value={layerName}
			type="text"
			class="px-4 py-2 border-[1px] rounded-md"
			placeHolder="New_Geojson_Layer..."
		/>
	</label>

	<div class="flex flex-row gap-2">
		<!-- Geometry Type Input -->
		<label class="flex flex-col w-full">
			<span class="font-bold mb-2">Geometry Type</span>
			<select bind:value={geometryType} class="px-4 py-2 border-[1px] rounded-md">
				<option value="Point">Point</option>
				<option value="LineString">LineString</option>
				<option value="Polygon">Polygon</option>
			</select>
		</label>

		<!-- Color Input -->
		<label class="flex flex-col w-fit">
			<span class="font-bold mb-2">Color</span>
			<input type="color" bind:value={layerColor} class="px-4 py-2 border-[1px] rounded-md" />
		</label>
	</div>

	<!-- File Upload -->
	<label class="flex flex-col">
		<span class="font-bold mb-2">Upload GeoJSON File</span>
		<input
			type="file"
			accept=".geojson,.json"
			on:change={handleFileUpload}
			class="px-4 py-2 border-[1px] rounded-md"
		/>
	</label>

	{#if showStatus}
		<div
			class="{isSuccessful
				? 'bg-green-800'
				: 'bg-red-800'} flex text-white p-2 w-full h-10 rounded-md text-center align-middle"
		>
			<p class="m-auto">{isSuccessful ? 'Layer Added Successfully' : 'Failed to Add Layer'}</p>
		</div>
	{:else}
		<button
			on:click={processLayer}
			disabled={!layerName || !layerColor || !geometryType || !geojson}
			title="Add Layer"
			class="bg-dark hover:bg-zinc-800 text-white p-2 w-full h-10 rounded-md"
		>
			<i class="fa-solid fa-map" aria-hidden="true" />
		</button>
	{/if}
</div>
