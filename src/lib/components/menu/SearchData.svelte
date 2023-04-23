<script lang="ts">
	import type { IDateTimeDictionaryType } from '$lib/types/types';

	export let dateTimeDictionary: IDateTimeDictionaryType;
	export let fetchEventsData: () => void;

	let isEndDateBeforeStartDate = false;
	function checkEndDateBeforeStartDate() {
		isEndDateBeforeStartDate = new Date(dateTimeDictionary.endDateTime) < new Date(dateTimeDictionary.startDateTime);
	}
</script>

<div class="flex flex-col">
	<div id="startDate" class="datepicker form-floating my-1  w-full" data-mdb-toggle-button="false">
		<label for="start_date">Start date</label>
		<input
			name="start_date"
			id="start_date"
			type="datetime-local"
			class="form-control date-picker p-2"
			placeholder="Select a date"
			data-mdb-toggle="datepicker"
			min="2010-01-01"
			max="2022-12-31"
			bind:value={dateTimeDictionary.startDateTime}
			on:input={checkEndDateBeforeStartDate}
		/>
	</div>

	<div id="endDate"  class="datepicker form-floating my-1 w-full" data-mdb-toggle-button="false">
		<label for="end_date">End date</label>
		<input
			name="end_date"
			id="end_date"
			type="datetime-local"
			class="form-control date-picker p-2 }"
			placeholder="Select End Date Time"
			data-mdb-toggle="datepicker"
			min="2010-01-01"
			max="2022-12-31"
			bind:value={dateTimeDictionary.endDateTime}
			on:input={checkEndDateBeforeStartDate}
		/>
	</div>

	{#if dateTimeDictionary.startDateTime && dateTimeDictionary.endDateTime}
		{#if isEndDateBeforeStartDate}
			<div class="alert alert-error my-1" role="alert">End date cannot be before start date.</div>
		{:else}
			<button class={`btn btn-primary my-1`} on:click={() => fetchEventsData()}
				><i class="fa-solid fa-database " /><span>Search Data</span>
			</button>
		{/if}
	{:else}
		<div class="alert alert-error my-1" role="alert">Select a Date and Time before Searching.</div>
	{/if}
</div>

