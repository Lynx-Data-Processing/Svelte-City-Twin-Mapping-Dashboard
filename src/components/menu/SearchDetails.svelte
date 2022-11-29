<script lang="ts">
	import type { dateTimeDictionaryType } from '../../types/types';

	import area from '@turf/area';
	export let dateTimeDictionary : dateTimeDictionaryType;
	export let selectedPolygon : any;
	export let fetchEventsData : Function;

	let areaString = '0m';
	let areaNumber = 0;
	const calculateArea = () => {
		try {
			const areaMeters = area(selectedPolygon);

			areaNumber = areaMeters;
			areaString =
				areaMeters < 1000000
					? areaMeters.toFixed(2) + 'm\xB2'
					: (areaMeters / 1000000).toFixed(2) + 'Km\xB2';

			console.log(areaNumber);
		} catch (err) {
			areaString = 'Error calculating area.';
		}
	};
	//$: selectedPolygon && calculateArea();

	let showTerms = true;
	const toggleTerms = () => {
		showTerms = !showTerms;
	};
</script>

<section class="card h-fit scale-in-center p-4 w-[32rem]">
	<div class="flex flow-row justify-between my-1">
		<div>
			<p>Search Vehicle Data:</p>
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
		{#if areaNumber <= 15000000 && dateTimeDictionary.startDateTime && dateTimeDictionary.endDateTime}
			<button class={`card-btn btn-green my-1`} on:click={() => fetchEventsData()}
				><i class="fa-solid fa-database " /> Search Data
			</button>
		{:else}
			<div class="alert alert-red my-1" role="alert">
				Select a Date, Time, and a Valid Polygon before Searching.
			</div>
		{/if}
	{/if}
</section>
