<script lang="ts">
	// Add geojson lets users add their own geojson data to the map
	import { GeojsonEnum } from '../../types/enums';
	import { rawGPSDataToGeojsonData } from '../../utils/geojson/geojson-utils.js';

	export let gpsData: any[];
	export let updateMapCenter: Function;
	let value = '';
	let name = '';
	let color = '#e66465';

	/**
	 * Adds GeoJSON data to the `gpsData` array and updates the map center.
	 * @param input The input data in the form of an object.
	 * @param name The name of the data.
	 * @param dataType The type of data, either 'Point' or 'Polygon'.
	 * @param color The color of the data.
	 */
	const addGeojsonData = (
		input: string,
		name = 'Own Data',
		dataType = GeojsonEnum.Point,
		color = 'Red'
	) => {
		try {
			gpsData = [rawGPSDataToGeojsonData(input, name, dataType, color)];
		} catch (error) {
			console.error(`Error converting input data to GeoJSON: ${error}`);
			return;
		}

		try {
			const coordinates =
				dataType === GeojsonEnum.Point
					? gpsData[0].features[0].geometry.coordinates
					: gpsData[0].features[0].geometry.coordinates[0][0];
			updateMapCenter(coordinates);
		} catch (error) {
			console.error(`Error updating map center: ${error}`);
		}
	};
</script>

<div class="flex flex-col">
	<hr class="my-2" />

	<input class="border w-full my-1 rounded-lg p-2" placeholder="GEOJSON Name" bind:value={name} />
	<p>Data Color:</p>
	<input class="my-1" type="color" id="head" name="head" bind:value={color} />
	<textarea class="border my-1 p-2" placeholder="Add GEOJSON Data" bind:value />

	{#if value !== '' && name !== '' && color !== ''}
		<button
			class={`btn btn-primary my-1`}
			on:click={() => addGeojsonData(value, name, GeojsonEnum.Point, color)}
			><i class="fa-solid fa-plus " /> Add Geojson Data
		</button>
	{:else}
		<div class="alert alert-error my-1" role="alert">
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
