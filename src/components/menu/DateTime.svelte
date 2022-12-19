<script lang="ts">
	import type { dateTimeDictionaryType } from '../../types/types';

	export let dateTimeDictionary :dateTimeDictionaryType;

	const clearDateTime = () => {
		Object.keys(dateTimeDictionary).reduce((accumulator, key) => {
		return {...accumulator, [key]: ''};
		}, {});
	};

	let showTerms = true;
	const toggleTerms = () => {
		showTerms = !showTerms;
	};

	export let fetchEventsData : Function;
</script>




<section class="card h-fit slide-in-left p-4 w-[32rem]">
	<div class="flex flow-row justify-between my-1">
		<div>
			<p>Date Time Selection:</p>
		</div>

		<div>
			<button on:click={toggleTerms} class="toggle-btn text-center hover:underline">
				{#if showTerms}
					<i class="fa-solid fa-arrow-up" />
					<span>Hide</span>
				{:else}
					<i class="fa-solid fa-arrow-down" />
					<span>Show</span>
				{/if}
			</button>
		</div>
	</div>

	{#if showTerms}
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
		{:else}
			<div class="alert alert-red my-1" role="alert">Select a Date and Time before Searching.</div>
		{/if}


		<p>Search Vehicle Data:</p>
		{#if  dateTimeDictionary.startDateTime && dateTimeDictionary.endDateTime}
			<button class={`card-btn btn-primary my-1`} on:click={() => fetchEventsData()}
				><i class="fa-solid fa-database " /> Search Data
			</button>
		{:else}
			<div class="alert alert-red my-1" role="alert">
				Select a Date, Time, and a Valid Polygon before Searching.
			</div>
		{/if}
	{/if}
</section>
