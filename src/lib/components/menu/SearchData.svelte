<script lang="ts">
	import { SEARCH_PARAMS } from '$lib/constants/initialData';
	import type { ISearchParamType } from '$lib/types/types';

	let tripsParams: ISearchParamType = SEARCH_PARAMS;
	export let fetchTripsData: Function;
	let isEndDateBeforeStartDate = false;
	const checkEndDateBeforeStartDate = () => {
		isEndDateBeforeStartDate =
			new Date(tripsParams.endDateTime) < new Date(tripsParams.startDateTime);
	};
</script>

<div class="flex flex-col gap-2 px-4 py-4">
	<div id="endpointSelect" class="search-container">
		<label for="endpoint_select">Endpoint</label>
		<input
			name="select_endpoint"
			id="enpoint_select"
			type="search"
			placeholder="Endpoint ID"
			class="form-control search-input rounded-lg"
			data-mdb-toggle="datepicker"
			bind:value={tripsParams.endpointId}
			disabled
		/>
	</div>

	<div class="flex flex-row gap-x-4">
		<div id="limit" class="number-picker-container my-1 w-full">
			<label for="limit">Limit</label>
			<input
				name="limit"
				id="limit"
				type="number"
				class="form-control search-input rounded-lg"
				placeholder="Limit"
				min="1"
				max="100"
				bind:value={tripsParams.limit}
				disabled
			/>
		</div>

		<div id="offset" class="number-picker-container my-1 w-full">
			<label for="offset">Offset</label>
			<input
				name="offset"
				id="offset"
				type="number"
				class="form-control search-input rounded-lg "
				placeholder="Offset"
				min="0"
				max="10"
				bind:value={tripsParams.offset}
				disabled
			/>
		</div>
	</div>

	<div id="startDate" class="datepicker form-floating my-1  w-full" data-mdb-toggle-button="false">
		<label for="start_date">Start date</label>
		<input
			name="start_date"
			id="start_date"
			type="datetime-local"
			class="form-control date-picker rounded-lg"
			placeholder="Select a date"
			data-mdb-toggle="datepicker"
			min="2010-01-01"
			max="2022-12-31"
			bind:value={tripsParams.startDateTime}
			on:input={checkEndDateBeforeStartDate}
			disabled
		/>
	</div>

	<div id="endDate" class="datepicker form-floating my-1 w-full" data-mdb-toggle-button="false">
		<label for="end_date">End date</label>
		<input
			name="end_date"
			id="end_date"
			type="datetime-local"
			class="form-control date-picker  rounded-lg"
			placeholder="Select End Date Time"
			data-mdb-toggle="datepicker"
			min="2010-01-01"
			max="2022-12-31"
			bind:value={tripsParams.endDateTime}
			on:input={checkEndDateBeforeStartDate}
			disabled
		/>
	</div>

	<span class="alert alert-error"
		>We apologize for the slower performance of our API due to the extensive volume of data being
		processed; however, please be assured that data retrieval is still fully functional</span
	>

	{#if tripsParams.startDateTime && tripsParams.endDateTime}
		{#if isEndDateBeforeStartDate}
			<div class="alert alert-error my-1" role="alert">End date cannot be before start date.</div>
		{:else}
			<button class={`btn btn-primary my-1`} on:click={() => fetchTripsData(tripsParams)}
				><i class="fa-solid fa-search " /><span>Search Data</span>
			</button>
		{/if}
	{:else}
		<div class="alert alert-error my-1" role="alert">Select a Date and Time before Searching.</div>
	{/if}
</div>
