<script lang="ts">
	import { onMount } from 'svelte';
	import { getDevicon } from '../utils/devicon-icons';
	export let eventList: any;

	const PROGRAMMING_TOOLS = ['googlecloud'];

	let videoFiles = [];
	let paginatedFiles: any = [];
	let paginationPage = 0;
	const numberOfItemsPerPageList = [10, 20, 30];
	let numberOfItemsPerPage = numberOfItemsPerPageList[0];
	let numberOfPages = 0;
	let paginationFrom = 0;
	let paginationTo = 0;

	onMount(() => {
		updatePaginationFiles();
	});

	//* Update the current pagination page
	const setPaginationPage = (page: number) => {
		if (page < 0) {
			paginationPage = 0;
		} else if (page >= numberOfPages) {
			paginationPage = numberOfPages - 1;
		} else {
			paginationPage = page;
		}

		updatePaginationFiles();
	};

	const updatePaginationFiles = () => {
		videoFiles = eventList;
		numberOfPages = Math.ceil(videoFiles.length / numberOfItemsPerPage);
		paginationFrom = paginationPage * numberOfItemsPerPage;
		paginationTo = Math.min((paginationPage + 1) * numberOfItemsPerPage, videoFiles.length);
		paginatedFiles = videoFiles.slice(
			paginationPage * numberOfItemsPerPage,
			paginationPage * numberOfItemsPerPage + numberOfItemsPerPage
		);
	};
	$: eventList && updatePaginationFiles();
</script>

<section class="my-8 px-4">
	<section class="card h-fit scale-in-center p-4">
		<p class="my-1">Video Table View:</p>
		{#if paginatedFiles.length}
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
					{#each paginatedFiles as event}
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

			<hr class="my-4" />
			<p>{`${paginationFrom + 1}-${paginationTo} of ${videoFiles.length}`}</p>
			<div class="flex items-center space-x-2 mt-2">
				<button
					disabled={paginationPage === 0}
					on:click={() => setPaginationPage(paginationPage - 1)}
					class="px-4 py-2  btn-gray-sm"
				>
					Previous
				</button>
				{#each Array(numberOfPages) as _, index (index)}
					<button
						on:click={() => setPaginationPage(index)}
						class={`px-4 py-2 ${
							paginationPage === index ? 'btn-pagination-primary-sm font-bold ' : 'btn-gray-sm'
						}`}
					>
						{index}
					</button>
				{/each}
				<button
					disabled={paginationPage === numberOfPages - 1}
					on:click={() => setPaginationPage(paginationPage + 1)}
					class="px-4 py-2  btn-gray-sm "
				>
					Next
				</button>
			</div>
		{:else}
			<div class="alert alert-red my-1" role="alert">No Events Found.</div>
		{/if}
	</section>
</section>
