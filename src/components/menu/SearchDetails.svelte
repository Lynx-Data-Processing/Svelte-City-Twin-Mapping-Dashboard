<script>
// @ts-nocheck

	import area from "@turf/area";
	export let dateTimeDictionary;
	export let selectedPolygon;
	export let fetchBigQueryData;

	let areaString = "0m";
	let areaNumber = 0;
	const calculateArea = () => {
		try {
			const areaMeters = area(selectedPolygon);

			areaNumber = areaMeters;
			areaString = areaMeters < 1000000 ? areaMeters.toFixed(2) + "m\xB2" : (areaMeters / 1000000).toFixed(2) + "Km\xB2";

			console.log(areaNumber);
		} catch (err) {
			areaString = "Error calculating area.";
		}
	};
	//$: selectedPolygon && calculateArea();
</script>

<section class="card h-fit scale-in-center p-4">
	<p class=" my-1">Search Vehicle Data:</p>
	{#if  areaNumber <= 15000000 && dateTimeDictionary.startDateTime && dateTimeDictionary.endDateTime}
		<button class={`card-btn btn-green my-1`} on:click={fetchBigQueryData}><i class="fa-solid fa-database " /> Search Data </button>
	{:else}
		<div class="alert alert-red my-1" role="alert">Select a Date, Time, and a Valid Polygon before Searching.</div>
	{/if}
</section>
