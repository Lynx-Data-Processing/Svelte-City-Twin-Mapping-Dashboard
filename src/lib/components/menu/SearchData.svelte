<script lang="ts">
	import type { ITripsParamType } from '$lib/types/types';
	
	let tripsParams: ITripsParamType = {
		endpointId: '',
		limit: 20,
		offset: 0,
		startDateTime: '2023-06-02T00:00',
		endDateTime: '2023-06-03T00:00'
	};
	export let fetchTripsData: Function;

	let isEndDateBeforeStartDate = false;
	function checkEndDateBeforeStartDate() {
		isEndDateBeforeStartDate = new Date(tripsParams.endDateTime) < new Date(tripsParams.startDateTime);
	}


</script>

<div class="flex flex-col">

	<div id="endpointSelect" class="search-container">
		<label for="endpoint_select">Endpoint</label>
		<input
			name="select_endpoint"
			id="enpoint_select"
			type="search"
			placeholder="Endpoint ID"
			class="form-control search-input "
			data-mdb-toggle="datepicker"
			bind:value={tripsParams.endpointId}
		/>
	</div>

	<div class="flex flex-row justify-between gap-x-4">
		<div id="limit" class="number-picker-container my-1 ">
			<label for="limit">Limit</label>
			<input
				name="limit"
				id="limit"
				type="number"
				class="form-control number-picker-input "
				placeholder="Limit"
				min="1"
				max="100"
				bind:value={tripsParams.limit}
			/>
		</div>

		<div id="offset" class="number-picker-container my-1 ">
			<label for="offset">Offset</label>
			<input
				name="offset"
				id="offset"
				type="number"
				class="form-control number-picker-input "
				placeholder="Offset"
				min="0"
				max="10"
				bind:value={tripsParams.offset}
			/>
		</div>
	</div>

	<div id="startDate" class="datepicker form-floating my-1  w-full" data-mdb-toggle-button="false">
		<label for="start_date">Start date</label>
		<input
			name="start_date"
			id="start_date"
			type="datetime-local"
			class="form-control date-picker"
			placeholder="Select a date"
			data-mdb-toggle="datepicker"
			min="2010-01-01"
			max="2022-12-31"
			bind:value={tripsParams.startDateTime}
			on:input={checkEndDateBeforeStartDate}
		/>
	</div>

	<div id="endDate"  class="datepicker form-floating my-1 w-full" data-mdb-toggle-button="false">
		<label for="end_date">End date</label>
		<input
			name="end_date"
			id="end_date"
			type="datetime-local"
			class="form-control date-picker  "
			placeholder="Select End Date Time"
			data-mdb-toggle="datepicker"
			min="2010-01-01"
			max="2022-12-31"
			bind:value={tripsParams.endDateTime}
			on:input={checkEndDateBeforeStartDate}
		/>
	</div>
	
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

