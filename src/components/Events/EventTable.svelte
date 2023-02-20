<script lang="ts">
	import type { eventType } from '../../types/eventTypes';
	import { getDevicon } from '../../utils/icons/devicon-icons';

	const PROGRAMMING_TOOLS = ['googlecloud'];
	export let updateMapCenter: Function;
	export let paginatedEvents: eventType[] = [];

	function goTop() {
		document.body.scrollIntoView();
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
			<th class="hidden md:table-cell">Saved On</th>
			<th class="hidden md:table-cell">Trigger Id</th>

			<th class="hidden md:table-cell">Has GPS Data</th>
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

				<td>{event.recordingStartTimestamp}</td>
				<td>{event.recordingEndTimestamp}</td>
				<td class="hidden md:table-cell">
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
				<td class="hidden md:table-cell">
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

				<td class="hidden md:table-cell">
					{#if event.snapshots[2]}
						<button
							class="btn btn-primary"
							on:click={() => {
								updateMapCenter(event.coordinates);
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
			</tr>
		{/each}
	</tbody>
</table>
