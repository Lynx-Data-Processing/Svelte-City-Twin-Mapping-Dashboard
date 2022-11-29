<script  lang="ts">
	import { SPEED_COLORS } from '../../constants';
	export let gpsData : any[];

	let showTerms = true;
	const toggleTerms = () => {
		showTerms = !showTerms;
	};
</script>

<section class="card h-fit scale-in-center p-4">
	

	<div class="flex flow-row justify-between my-1">
		<div>
			<p >Speed Legend (Km/h):</p>
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
		{#if gpsData.length <= 0}
			<div class="alert alert-red my-1" role="alert">No GPS Data Selected.</div>
		{:else}
			<div class="overflow-auto h-fit">
				{#each SPEED_COLORS as speedColor, i}
					<p class="list-item my-2">
						<i class="dot" style={`--color:${speedColor}`} />
						{i * 10} - {(i + 1) * 10 - 1}
					</p>
				{/each}
				<p class="list-item my-2">
					<i class="dot" style={`--color:${SPEED_COLORS[SPEED_COLORS.length - 1]}`} /> 100+
				</p>
			</div>
		{/if}
	{/if}

	
</section>
