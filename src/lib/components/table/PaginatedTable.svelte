<script lang="ts">
	import { onMount } from 'svelte';

	import PaginationButtons from './PaginationButtons.svelte';
	import TripTable from './TripTable.svelte';
	export let tableData: any;
	export let updateMapCenter: Function;

	let totalNumberOfItems = tableData.length;
	let paginatedTableData: any = [];
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
		numberOfPages = Math.ceil(tableData.length / numberOfItemsPerPage);
		paginationFrom = paginationPage * numberOfItemsPerPage;
		paginationTo = Math.min((paginationPage + 1) * numberOfItemsPerPage, tableData.length);
		paginatedTableData = tableData.slice(
			paginationPage * numberOfItemsPerPage,
			paginationPage * numberOfItemsPerPage + numberOfItemsPerPage
		);
	};
	$: tableData && updatePaginationFiles();
</script>

<div class="flex flex-col">
	{#if paginatedTableData.length}
		<TripTable paginatedTrips={paginatedTableData} {updateMapCenter} />

		<PaginationButtons
			{paginationFrom}
			{paginationTo}
			{paginationPage}
			{totalNumberOfItems}
			{numberOfPages}
			{setPaginationPage}
		/>
	{:else}
		<div class="alert alert-error my-1" role="alert">No Data Found.</div>
	{/if}
</div>
