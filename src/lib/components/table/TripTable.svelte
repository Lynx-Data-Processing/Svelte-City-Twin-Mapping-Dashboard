<script lang="ts">
	import type { ITrip } from '$lib/types/tripTypes';
	import { millisecondUnixToDateTime } from '$lib/utils/date-format';
	import { exportJSONToFile } from '$lib/utils/download-utils';

	export let updateMapCenter: Function;
	export let paginatedTrips: ITrip[] = [];

	const updateCenter = (trip: ITrip, isStart: boolean) => {
		const pos = isStart ? trip.startGeo : trip.endGeo;
		const latLng = { lat: pos.lat, lng: pos.lon };
		updateMapCenter(latLng, 'Point');
		goTop();
	};

	function goTop() {
		document.body.scrollIntoView();
	}
</script>

<table class="table w-full ">
	<thead>
		<tr>
			<th>Id</th>
			<th>Endpoint</th>
			<th>Start Time</th>
			<th>End Time</th>
			<th>Trip Status</th>
			<th>Distance</th>
		
			<th class="hidden xl:table-cell ">Options</th>
		</tr>
	</thead>
	<tbody>
		{#each paginatedTrips as trip}
			<tr>
				<td>{trip.id}</td>
				<td>
					<p>{trip.endpointName}</p>
					<p>{trip.endpointId}</p>
				</td>
				<td>{trip.startTimestamp ? millisecondUnixToDateTime(trip.startTimestamp) : "N/A"}</td>
				<td>{trip.endTimestamp ? millisecondUnixToDateTime(trip.endTimestamp) : "N/A"}</td>
				<td>
					{#if trip.tripStatus === 'STARTED'}
						<div class={`alert alert-success w-full text-center`} role="alert">
							{trip.tripStatus}
						</div>
					{:else}
						<div class={`alert alert-info w-full text-center`} role="alert">
							{trip.tripStatus}
						</div>
					{/if}
				</td>
				<td>{trip.distance ? `${trip.distance.toFixed(2)} km` : 'N/A'}</td>
			
				<td class="hidden xl:table-cell ">
					<div class="flex flex-row gap-4 w-full justify-center">
						<button
						class="btn btn-black-outline"
						on:click={() => {
							updateCenter(trip, true);
						}}
					>
						<i class="fa-solid fa-eye" />
						<span>View Trip</span>
					</button>
					<button
						class="btn btn-black-outline"
						on:click={() => {
							exportJSONToFile(trip, `${trip.id}-data.json`);
						}}
					>
						<i class="fa-solid fa-download" />
						<span>Download</span>
					</button>
					</div>
				
				</td>
			</tr>
		{/each}
	</tbody>
</table>
