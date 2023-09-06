<script lang="ts">
	import AlertError from '$lib/components/AlertError.svelte';
	import { SEARCH_PARAMS } from '$lib/features/menu/constants/searchParam';
	import type { ISearchParamType } from '$lib/features/menu/types/searchParamTypes';

	let tripsParams: ISearchParamType = SEARCH_PARAMS;
	export let fetchTripsData: Function;
	let isEndDateBeforeStartDate = false;
	const checkEndDateBeforeStartDate = () => {
		isEndDateBeforeStartDate =
			new Date(tripsParams.endDateTime) < new Date(tripsParams.startDateTime);
	};
</script>

<div class="flex flex-col gap-4 p-4">
	<div id="endpointSelect">
		<label for="endpoint_select">Endpoint</label>
		<input
			name="select_endpoint"
			id="enpoint_select"
			type="search"
			placeholder="Endpoint ID"
			class="form-control flex flex-row gap-2 px-4 py-2 border-[1px] h-10 bg-white hover:bg-smoke w-full  text-sm rounded-md"
			data-mdb-toggle="datepicker"
			bind:value={tripsParams.endpointId}
		/>
	</div>

	<div class="flex flex-row gap-2">
		<div id="startDate" class="datepicker form-floating w-full" data-mdb-toggle-button="false">
			<label for="start_date">Start date</label>
			<input
				name="start_date"
				id="start_date"
				type="date"
				class="flex flex-row gap-2 px-4 py-2 border-[1px] h-10 bg-white hover:bg-smoke w-full  text-sm rounded-md"
				placeholder="Select a date"
				data-mdb-toggle="datepicker"
				min="2010-01-01"
				max="2022-12-31"
				bind:value={tripsParams.startDateTime}
				on:input={checkEndDateBeforeStartDate}
			/>
		</div>

		<div id="endDate" class="datepicker form-floating w-full" data-mdb-toggle-button="false">
			<label for="end_date">End date</label>
			<input
				name="end_date"
				id="end_date"
				type="date"
				class="flex flex-row gap-2 px-4 py-2 border-[1px] h-10 bg-white hover:bg-smoke w-full  text-sm rounded-md"
				placeholder="Select End Date Time"
				data-mdb-toggle="datepicker"
				min="2010-01-01"
				max="2022-12-31"
				bind:value={tripsParams.endDateTime}
				on:input={checkEndDateBeforeStartDate}
			/>
		</div>
	</div>

	{#if tripsParams.startDateTime && tripsParams.endDateTime}
		{#if isEndDateBeforeStartDate}
			<AlertError message={'End Date Time must be after Start Date Time'} />
		{:else}
			<button
				title={'Search Data'}
				on:click={() => fetchTripsData(tripsParams)}
				class="flex flex-row gap-2 px-4 py-2 border-[1px]  w-full h-10 bg-primary text-white hover:bg-primary-dark rounded-md"
			>
				<i class={`fa-solid fa-search mr-2 my-auto`} />
				<p class="my-auto">Search Data</p>
			</button>
		{/if}
	{:else}
		<AlertError message={'Select a Date and Time before Searching'} />
	{/if}
</div>
