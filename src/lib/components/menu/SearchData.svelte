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

<div class="flex flex-col gap-4 px-4 py-4">
	<div id="endpointSelect">
		<label for="endpoint_select">Endpoint</label>
		<input
			name="select_endpoint"
			id="enpoint_select"
			type="search"
			placeholder="Endpoint ID"
			class="form-control search-input"
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
				class="search-input"
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
				class="search-input"
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
			<div class="alert alert-error "><span>End date cannot be before start date</span></div>
		{:else}
			<button on:click={() => fetchTripsData(tripsParams)} class={`btn w-full btn-primary`}>
				<div class="flex flex-row justify-between gap-4">
					<i class={`fa-solid fa-search icon-color`} />
					<span>Search Data</span>
				</div>
			</button>
		{/if}
	{:else}
		<div class="alert alert-error "><span>Select a Date and Time before Searching</span></div>
	{/if}
</div>
