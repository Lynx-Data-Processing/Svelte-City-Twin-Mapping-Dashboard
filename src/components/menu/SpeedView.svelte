<script lang="ts">
	import { SPEED_COLORS } from '../../constants';
	export let gpsData: any[];
</script>

<div class="flex flex-row">
	{#if gpsData.length}
		<div class="overflow-auto h-fit w-full">
			{#each SPEED_COLORS as speedColor, i}
				<div class="btn my-1 w-full">
					<i class="dot" style={`--color:${speedColor}`} />
					{i * 10} - {(i + 1) * 10 - 1} Km/h
				</div>
			{/each}
			<p class="btn my-1 w-full">
				<i class="dot" style={`--color:${SPEED_COLORS[SPEED_COLORS.length - 1]}`} /> 100+ Km/h
			</p>
		</div>
	{:else}
		<div class="alert alert-error my-1 w-full" role="alert">No GPS Data Selected.</div>
	{/if}
</div>
