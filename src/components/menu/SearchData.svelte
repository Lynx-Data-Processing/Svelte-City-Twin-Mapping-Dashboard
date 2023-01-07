<script lang="ts">
	import type { dateTimeDictionaryType } from '../../types/types';

	export let dateTimeDictionary: dateTimeDictionaryType;

	const clearDateTime = () => {
		Object.keys(dateTimeDictionary).reduce((accumulator, key) => {
			return { ...accumulator, [key]: '' };
		}, {});
	};

	export let fetchEventsData: Function;
</script>

<div class="flex flex-col">
	<div class="datepicker form-floating my-1  w-full" data-mdb-toggle-button="false">
		<label for="floatingInput">Select Start date</label>
		<input
			type="datetime-local"
			class="form-control date-picker p-2"
			placeholder="Select a date"
			data-mdb-toggle="datepicker"
			min="2010-01-01"
			max="2022-12-31"
			bind:value={dateTimeDictionary.startDateTime}
		/>
	</div>

	<div class="datepicker form-floating my-1 w-full" data-mdb-toggle-button="false">
		<label for="floatingInput">Select End date</label>
		<input
			type="datetime-local"
			class="form-control date-picker p-2"
			placeholder="Select End Date Time"
			data-mdb-toggle="datepicker"
			min="2010-01-01"
			max="2022-12-31"
			bind:value={dateTimeDictionary.endDateTime}
		/>
	</div>

	{#if dateTimeDictionary.startDateTime && dateTimeDictionary.endDateTime}
		<div class="alert alert-green my-1" role="alert">
			{dateTimeDictionary.startDateTime} to {dateTimeDictionary.endDateTime}
			<button class="float-right fa-lg" on:click={clearDateTime}
				><i class="fa-solid fa-xmark " /></button
			>
		</div>

		<button class={`btn btn-primary my-1`} on:click={() => fetchEventsData()}
			><i class="fa-solid fa-database " /> Search Data
		</button>
	{:else}
		<div class="alert alert-red my-1" role="alert">Select a Date and Time before Searching.</div>
	{/if}
</div>
