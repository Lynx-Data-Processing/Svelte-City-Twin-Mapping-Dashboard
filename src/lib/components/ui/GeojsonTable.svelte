<script lang="ts">
	import type { IGeojsonType } from '$lib/types/geojsonTypes';

	export let geojson: IGeojsonType;
	const geojsonProperties = geojson.features[0].properties;
	const geojsonPropertiesKeys = Object.keys(geojsonProperties);
</script>

<table class="table  w-full">
	<tr>
		<th class=" p-2 "><span>Id</span></th>
		{#each geojsonPropertiesKeys as key}
			<th><span class="p-2 ">{key}</span></th>
		{/each}
	</tr>

	<tbody>
		{#each geojson.features.slice(0, 50) as feature, i}
			<tr>
				<td><span class="p-2">{i}</span></td>
				{#each geojsonPropertiesKeys as key}
					<td class="p-2 "><span class="ellipsis">{feature.properties[key]}</span></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
