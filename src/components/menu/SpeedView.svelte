<script lang="ts">
	import { SPEED_COLORS } from '../../constants';
</script>

<div class="flex flex-col ">
	{#each SPEED_COLORS as speedColor, i}
		<div class="my-1 w-full">
			<i class="dot" style={`--color:${speedColor}`} />
			<span class="ml-2">{i * 10} - {(i + 1) * 10 - 1} Km/h</span>
		</div>
	{/each}
	<div class="my-1 w-full">
		<i class="dot" style={`--color:${SPEED_COLORS[SPEED_COLORS.length - 1]}`} /><span class="ml-2"
			>100+ Km/h</span
		>
	</div>
</div>
