<script lang="ts">
	import type { eventType } from '../../types/types';
	import { getDevicon } from '../../utils/icons/devicon-icons';

	const PROGRAMMING_TOOLS = ['googlecloud'];
	export let paginatedEvents: eventType[] = [];
</script>

<table class="table w-full rounded-lg">
	<thead>
		<tr>
			<th>Id</th>

			<th>Road</th>
			<th>Inside</th>
			<th>Device Id</th>
			<th>Device Label</th>

			<th>Start Time</th>
			<th>End Time</th>
			<th>Saved On</th>
			<th>Trigger Id</th>

			<th>Has GPS Data</th>
		</tr>
	</thead>
	<tbody>
		{#each paginatedEvents as event}
			<tr>
				<td>{event.id}</td>

				<td class="w-32">
					<img
						class="w-32 h-16 overflow-hidden rounded-lg"
						height="auto"
						width="100%"
						alt="Dashcam"
						src={event.snapshots[0].downloadUrl}
					/>
				</td>

				<td class="w-32">
					<img
						class="w-32 h-16 overflow-hidden rounded-lg"
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
				<td>
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
				<td>
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

				<td>
					{#if event.snapshots[2]}
						<div class={`alert alert-success w-full text-center`} role="alert">
							<i class="fa-solid fa-check  fa-lg" />
						</div>
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
