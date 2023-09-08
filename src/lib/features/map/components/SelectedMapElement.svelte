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

	function isImage(url: any) {
		try {
			return typeof url === 'string' && /\.(jpeg|jpg|gif|png)$/i.test(url);
		} catch (e) {
			return false;
		}
	}

	function isVideo(url: any) {
		try {
			return typeof url === 'string' && /\.(mp4|webm|ogg)$/i.test(url);
		} catch (e) {
			return false;
		}
	}

	function isColor(value: any) {
		try {
			return typeof value === 'string' && /^#([0-9a-f]{3}){1,2}$/i.test(value);
		} catch (e) {
			return false;
		}
	}

	function isNumber(value: any) {
		try {
			return !isNaN(parseFloat(value)) && isFinite(value);
		} catch (e) {
			return false;
		}
	}

	 // Function to stringify objects
	 function stringifyObject(obj: any): string {
        try {
            return typeof obj === 'object' ? JSON.stringify(obj) : obj;
        } catch (e) {
            return 'Invalid Object';
        }
    }
</script>

<div class="flex flex-col p-4 gap-2">
	{#if selectedMapElement}
		{#each properties as property}
			{#if isImage(property.value)}
				<img class="rounded-md" src={property.value} alt={property.name} />
			{:else if isVideo(property.value)}
				<video class="rounded-md" controls>
					<track kind="captions" />
					<source src={property.value} type="video/mp4">
					Your browser does not support the video tag.
				</video>
			{:else}
				<!-- other types will go to the table -->
			{/if}
		{/each}
		<table>
			<thead>
				<tr class="text-left">
					<th class="font-bold w-1/2">Key</th>
					<th class="font-bold w-1/2">Value</th>
				</tr>
			</thead>
			<tbody>
				{#each properties as property}
					{#if !isImage(property.value) && !isVideo(property.value)}
						<tr>
							<td>{property.name}</td>
							<td>
								{#if isColor(property.value)}
                                    <span style="color: {property.value};">{property.value}</span>
                                {:else if isNumber(property.value)}
                                    <span>{property.value}</span>
                                {:else}
                                    <!-- Stringify objects or other unknown types -->
                                    <span>{stringifyObject(property.value)}</span>
                                {/if}
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	{:else}
		<p>No map element selected</p>
	{/if}
</div>
