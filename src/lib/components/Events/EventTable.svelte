<script lang="ts">
	import type { IEventType } from '$lib/types/eventTypes';
	import type { IGeojsonDataType } from '$lib/types/geojsonTypes';
	import { millisecondUnixToDateTime } from '$lib/utils/date-format';
	import { getDevicon } from '$lib/utils/devicon-icons';

	const PROGRAMMING_TOOLS = ['googlecloud'];
	export let updateMapCenter: Function;
	export let paginatedEvents: IEventType[] = [];

	function goTop() {
		document.body.scrollIntoView();
	}


	function exportJSONToFile(jsonData: object, filename: string) {
		const dataStr = JSON.stringify(jsonData, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
		const url = URL.createObjectURL(dataBlob);

		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.style.display = 'none';

		document.body.appendChild(link);
		link.click();

		// Remove the link and revoke the object URL
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
</script>

<table class="table w-full ">
	<thead>
		<tr>
			<th>Id</th>

			<th>Road</th>
			<th>Inside</th>
			<th>Device Id</th>
			<th>Device Label</th>

			<th>Start Time</th>
			<th>End Time</th>
			<th class="hidden xl:table-cell ">Saved On</th>
			<th class="hidden xl:table-cell ">Trigger Id</th>

			<th class="hidden xl:table-cell ">Has GPS Data</th>
			<th class="hidden xl:table-cell ">Download</th>
		</tr>
	</thead>
	<tbody>
		{#each paginatedEvents as event}
			<tr>
				<td>{event.id}</td>

				<td class="w-32">
					<img
						class="w-32 h-16 overflow-hidden "
						height="auto"
						width="100%"
						alt="Dashcam"
						src={event.snapshots[0].downloadUrl}
					/>
				</td>

				<td class="w-32">
					<img
						class="w-32 h-16 overflow-hidden "
						height="100%"
						width="100%"
						alt="Dashcam"
						src={event.snapshots[1].downloadUrl}
					/>
				</td>
				<td>{event.deviceId}</td>
				<td class="text-primary">{event.deviceLabel}</td>

				<td>{millisecondUnixToDateTime(event.recordingStartTimestamp)}</td>
				<td>{millisecondUnixToDateTime(event.recordingEndTimestamp)}</td>
				<td class="hidden xl:table-cell ">
					<div class="flex flex-wrap justify-center  ">
						{#each PROGRAMMING_TOOLS as icon}
							<img
								height="100"
								width="auto"
								title={icon}
								class={`img-icon w-8 mx-2 py-2`}
								alt=""
								src={getDevicon(icon)}
								loading="lazy"
							/>
						{/each}
					</div>
				</td>
				<td class="hidden xl:table-cell ">
					{#if event.eventTriggerId === 'EMERGENCY_RECORD'}
						<div class={`alert alert-error w-full text-center`} role="alert">
							{event.eventTriggerId}
						</div>
					{:else}
						<div class={`alert alert-info w-full text-center`} role="alert">
							{event.eventTriggerId}
						</div>
					{/if}
				</td>

				<td class="hidden xl:table-cell ">
					{#if event.snapshots[2]}
						<button
							class="btn btn-primary"
							on:click={() => {
								updateMapCenter(event.coordinates, "Point");
								goTop();
							}}
						>
							<i class="fa-solid fa-map-marker-alt" />
							<span>View on Map</span>
						</button>
					{:else}
						<div class={`alert alert-error w-full text-center`} role="alert">
							<i class="fa-solid fa-x  fa-lg" />
						</div>
					{/if}
				</td>

				<td class="hidden xl:table-cell ">
					{#if event.snapshots[2]}
						<button
							class="btn btn-black-outline"
							on:click={() => {
								exportJSONToFile(event, `${event.id}-data.json`);
							}}
						>
							<i class="fa-solid fa-download" />
							<span>Download</span>
						</button>
					{:else}
						<div class={`alert alert-error w-full text-center`} role="alert">
							<i class="fa-solid fa-x  fa-lg" />
						</div>
					{/if}
			</tr>
		{/each}
	</tbody>
</table>
