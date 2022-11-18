<script>
	import { SPEED_COLORS } from "../../constants";
	export let gpsData;
</script>

<section class="card h-fit scale-in-center p-4">
	<p class=" my-1">Speed Legend (Km/h):</p>
	{#if gpsData.length <= 0}
		<div class="alert alert-red my-1" role="alert">No GPS Data Selected.</div>
	{:else}
		<div class="overflow-auto h-full">
			{#each SPEED_COLORS as speedColor, i}
				<p class="list-item my-2"><i class="dot" style={`--color:${speedColor}`} /> {i * 10} - {(i + 1) * 10 - 1}</p>
			{/each}
			<p class="list-item my-2"><i class="dot" style={`--color:${SPEED_COLORS[SPEED_COLORS.length - 1]}`} /> 100+</p>
		</div>
	{/if}
</section>
