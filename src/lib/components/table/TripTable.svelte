<script lang="ts">
	import type { ITrip } from '$lib/types/tripTypes';
	import { millisecondUnixToDateTime } from '$lib/utils/date-format';
	import { exportJSONToFile } from '$lib/utils/download-utils';

	export let updateMapCenter: Function;
	export let paginatedTrips: ITrip[] = [];

	function goTop() {
		document.body.scrollIntoView();
	}
</script>

<table class="table w-full ">
	<thead>
		<tr>
			<th>Id</th>
			<th>Endpoint Id</th>
			<th>Endpoint Name</th>
			<th>Start Time</th>
			<th>End Time</th>
			<th>Trip Status</th>
			<th>Distance</th>
			<th class="hidden xl:table-cell ">View Start Location</th>
			<th class="hidden xl:table-cell ">View End Location</th>
			<th class="hidden xl:table-cell ">Download</th>
		</tr>
	</thead>
	<tbody>
		{#each paginatedTrips as trip}
			<tr>
				<td>{trip.id}</td>
				<td>{trip.endpointId}</td>
				<td class="text-primary">{trip.endpointName}</td>
				<td>{millisecondUnixToDateTime(trip.startTimestamp)}</td>
				<td>{millisecondUnixToDateTime(trip.endTimestamp)}</td>
				<td>
                
                    {#if trip.tripStatus === 'ERROR'}
                    <div class={`alert alert-error w-full text-center`} role="alert">
                        {trip.tripStatus}
                    </div>
                {:else}
                    <div class={`alert alert-info w-full text-center`} role="alert">
                        {trip.tripStatus}
                    </div>
                {/if}
                
                </td>
				<td>{trip.distance.toFixed(2)} km</td>
				<td class="hidden xl:table-cell ">
					<button
						class="btn btn-primary"
						on:click={() => {
							updateMapCenter(trip.startGeo, "Point");
							goTop();
						}}
					>
						<i class="fa-solid fa-map-marker-alt" />
						<span>View Start</span>
					</button>
				</td>
				<td class="hidden xl:table-cell ">
					<button
						class="btn btn-primary"
						on:click={() => {
							updateMapCenter(trip.endGeo, "Point");
							goTop();
						}}
					>
						<i class="fa-solid fa-map-marker-alt" />
						<span>View End</span>
					</button>
				</td>
				<td class="hidden xl:table-cell ">
					<button
						class="btn btn-black-outline"
						on:click={() => {
							exportJSONToFile(trip, `${trip.id}-data.json`);
						}}
					>
						<i class="fa-solid fa-download" />
						<span>Download</span>
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
