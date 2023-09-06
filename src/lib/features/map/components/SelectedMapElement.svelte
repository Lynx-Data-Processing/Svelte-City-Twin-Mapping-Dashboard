<script lang="ts">
	import { mapStore } from '../store/mapStore';

	let selectedMapElement: google.maps.Data.Feature | undefined;
	let properties: Array<{ name: string; value: any }> = [];

	mapStore.subscribe((value) => {
		selectedMapElement = value.selectedMapElement;

		// Reset properties array
		properties = [];

		// Loop through each property and add to array
		selectedMapElement?.forEachProperty((value, name) => {
			properties.push({ name, value });
		});
	});

    // It would be a good idea to create some sort of check to create images, links, etc. based on the property name and value
    // Sounds like nightmare fuel though
</script>

<div class="flex flex-col p-4 gap-2">
    {#if selectedMapElement}
        {#each properties as property}
            <p>{property.name} : {property.value}</p>
        {/each}
    {:else}
        <p>No map element selected</p>
    {/if}
</div>
