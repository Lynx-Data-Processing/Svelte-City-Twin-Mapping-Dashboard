<script lang="ts">
	import { SPEED_COLORS } from '../../constants';
	export let gpsData: any[];
</script>

<div class="flex flex-row">
	{#if gpsData.length}
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
	{:else}
		<div class="alert alert-red my-1" role="alert">No GPS Data Selected.</div>
	{/if}
</div>
