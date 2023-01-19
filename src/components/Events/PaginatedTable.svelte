<script lang="ts">
	import { onMount } from 'svelte';
	import EventTable from './EventTable.svelte';
	import PaginationButtons from './PaginationButtons.svelte';
	export let eventList: any;

	let totalNumberOfItems = eventList.length;
	let paginatedEvents: any = [];
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
		numberOfPages = Math.ceil(eventList.length / numberOfItemsPerPage);
		paginationFrom = paginationPage * numberOfItemsPerPage;
		paginationTo = Math.min((paginationPage + 1) * numberOfItemsPerPage, eventList.length);
		paginatedEvents = eventList.slice(
			paginationPage * numberOfItemsPerPage,
			paginationPage * numberOfItemsPerPage + numberOfItemsPerPage
		);
	};
	$: eventList && updatePaginationFiles();
</script>

<div class="flex flex-col">
	{#if paginatedEvents.length}
		<EventTable {paginatedEvents} />

		<PaginationButtons
			{paginationFrom}
			{paginationTo}
			{paginationPage}
			{totalNumberOfItems}
			{numberOfPages}
			{setPaginationPage}
		/>
	{:else}
		<div class="alert alert-error my-1" role="alert">No Events Found.</div>
	{/if}
</div>
