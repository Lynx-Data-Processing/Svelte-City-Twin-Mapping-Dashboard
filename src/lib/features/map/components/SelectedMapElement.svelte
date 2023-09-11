<script lang="ts">
	import { isColor, isImage, isNumber, isVideo, stringifyObject } from '$lib/utils/value-type';
	import { mapStore } from '../store/mapStore';

	let selectedMapElement: google.maps.Data.Feature | undefined;
	let properties: Array<{ name: string; value: any }> = [];

	mapStore.subscribe((value) => {
		selectedMapElement = value.selectedMapElement;
		properties = [];
		selectedMapElement?.forEachProperty((value, name) => {
			properties.push({ name, value });
		});
	});
</script>

<div class="flex flex-col p-4 gap-2">
	{#if selectedMapElement}
		{#each properties as property}
			{#if isImage(property.value)}
				<img class="rounded-md" src={property.value} alt={property.name} />
			{:else if isVideo(property.value)}
				<video class="rounded-md" controls>
					<track kind="captions" />
					<source src={property.value} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			{/if}
		{/each}
		<table class="w-full border-collapse rounded-md overflow-hidden">
			<thead>
				<tr class="text-left bg-zinc-200 rounded-md overflow-hidden  h-10">
					<th class="font-bold w-1/2 p-2 ">Key</th>
					<th class="font-bold w-1/2 p-2 ">Value</th>
				</tr>
			</thead>
			<tbody>
				{#each properties as property, idx}
					{#if !isImage(property.value) && !isVideo(property.value)}
						<tr class="{idx % 2 == 0 ? 'bg-white ' : 'bg-zinc-50'} hover:bg-zinc-100 h-10">
							<td class="p-2 ">{property.name}</td>
							<td class="p-2 ">
								{#if isColor(property.value)}
									<span class="flex flex-row gap-2" style="color: {property.value};">
										<span
											class="rounded-full h-4 w-4"
											style="background-color: {property.value};"
										/>
										{property.value}
									</span>
								{:else if isNumber(property.value)}
									<span>{property.value}</span>
								{:else}
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
