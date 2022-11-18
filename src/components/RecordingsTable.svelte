<script>
	import { onMount } from "svelte";
	export let files;

	const PROGRAMMING_TOOLS = ["googlecloud"];
	const returnLinkGivenIfStringContains = (toolString) => {
		if (toolString.includes("GoogleDrive")) {
			return `icons/${toolString}.svg`;
		}

		if (toolString.includes("plain")) {
			const tempString = toolString.replace("-plain", "");
			return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tempString}/${tempString}-plain.svg`;
		}

		if (toolString.includes("wordmark")) {
			const tempString = toolString.replace("-wordmark", "");
			return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tempString}/${tempString}-wordmark.svg`;
		}

		return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${toolString}/${toolString}-original.svg`;
	};

	let videoFiles = [];
	let paginatedFiles = [];
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
	const setPaginationPage = (page) => {
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
		videoFiles = files;
		numberOfPages = Math.ceil(videoFiles.length / numberOfItemsPerPage);
		paginationFrom = paginationPage * numberOfItemsPerPage;
		paginationTo = Math.min((paginationPage + 1) * numberOfItemsPerPage, videoFiles.length);
		paginatedFiles = videoFiles.slice(paginationPage * numberOfItemsPerPage, paginationPage * numberOfItemsPerPage + numberOfItemsPerPage);
	};

	$:files && updatePaginationFiles();
</script>

<section class="card h-fit scale-in-center">
	<div class="p-4">
		<p class="font-bold my-1">Video Table View:</p>
		{#if paginatedFiles.length}
			<table class="table w-full rounded-lg">
				<thead>
					<tr>
						<th>Video (Front)</th>
                        <th>Video (Back)</th>
                        <th>Device Id</th>
                        <th>Device Label</th>
                        <th>Saved On</th>
                        <th>Trigger Name</th>
                  
						
					</tr>
				</thead>
				<tbody>
					{#each paginatedFiles as event}
					
							<tr>
								<td class="w-64">
                                    <img
                                        src={event.snapshots[0].downloadUrl}
                                        onerror="https://i.picsum.photos/id/870/200/300.jpg?blur=2&grayscale&hmac=ujRymp644uYVjdKJM7kyLDSsrqNSMVRPnGU99cKl6Vs"
                                        alt="Dashcam"
                                        class="h-full w-auto object-cover rounded-lg"
									/>			
								</td>

                                <td class="w-64">
                                    <img
                                        src={event.snapshots[1].downloadUrl}
                                        onerror="https://i.picsum.photos/id/870/200/300.jpg?blur=2&grayscale&hmac=ujRymp644uYVjdKJM7kyLDSsrqNSMVRPnGU99cKl6Vs"
                                        alt="Dashcam"
                                        class="h-full w-auto object-cover rounded-lg"
									/>			
								</td>
                              
                                <td>{event.deviceId}</td>
                                <td>{event.deviceLabel}</td>
                                <td>
									<div class="flex flex-wrap justify-center  ">
										{#each PROGRAMMING_TOOLS as tool}
											<img height="100" width="auto" title={tool} key={tool} class={`img-icon w-8 mx-2 py-2`} alt="" src={returnLinkGivenIfStringContains(tool)} loading="lazy" />
										{/each}
									</div>
								</td>
                                <td>{event.triggerName}</td>
                              
							</tr>

                    
					{/each}
				</tbody>
			</table>

			<hr class="my-4" />
			<p>{`${paginationFrom + 1}-${paginationTo} of ${videoFiles.length}`}</p>
			<div class="flex items-center space-x-2 mt-2">
				<button on:click={() => setPaginationPage(paginationPage - 1)} class="px-4 py-2  btn-pagination"> Previous </button>
				{#each Array(numberOfPages) as _, index (index)}
					<button on:click={() => setPaginationPage(index)} class={`px-4 py-2 ${paginationPage === index ? "btn-pagination-primary font-bold " : "btn-pagination"}`}>
						{index}
					</button>
				{/each}
				<button on:click={() => setPaginationPage(paginationPage + 1)} class="px-4 py-2  btn-pagination "> Next </button>
			</div>
		{:else}
			<div class="alert alert-red my-1" role="alert">No Google Drive Files Found.</div>
		{/if}
	</div>
</section>
