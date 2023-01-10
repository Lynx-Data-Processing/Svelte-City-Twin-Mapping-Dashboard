<script lang="ts">
	import type { eventType } from '../../types/types';
	import { getDevicon } from '../../utils/icons/devicon-icons';

	const PROGRAMMING_TOOLS = ['googlecloud'];
	export let paginatedEvents: eventType[] = [];
</script>

<table class="table w-full rounded-lg">
	<thead>
		<tr>
			<th>Video (Road)</th>
			<th>Video (Inside)</th>
			<th>Device Id</th>
			<th>Device Label</th>
			<th>Start Time</th>
			<th>End Time</th>
			<th>Saved On</th>
			<th>Trigger ID</th>
			<th>Trigger Name</th>
			<th>Has GPS Data</th>
		</tr>
	</thead>
	<tbody>
		{#each paginatedEvents as event}
			<tr>
				<td class="w-32">
					<img
						src={event.snapshots[0].downloadUrl}
						alt="Dashcam"
						class="h-full w-auto object-cover rounded-lg"
					/>
				</td>

				<td class="w-32">
					<img
						src={event.snapshots[1].downloadUrl}
						alt="Dashcam"
						class="h-full w-auto object-cover rounded-lg"
					/>
				</td>

				<td>{event.deviceId}</td>
				<td>{event.deviceLabel}</td>

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
				<td>{event.eventTriggerId}</td>
				<td>{event.triggerName}</td>
				<td>
					{#if event.snapshots[2]}
						<i class="fa-solid fa-check text-success fa-lg" />
					{:else}
						<i class="fa-solid fa-x text-error fa-lg" />
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
