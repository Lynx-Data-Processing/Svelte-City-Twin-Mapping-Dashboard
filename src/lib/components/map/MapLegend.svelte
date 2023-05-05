<script lang="ts">
	import { SPEED_COLORS } from '$lib/constants';
	let scale = 10;
</script>

  <div class="flex flex-col">
	{#each SPEED_COLORS as color, index}
	  <div class="my-1 flex flex-row">
		<div class="w-6 h-6" style="background-color: {color}"></div>
		<p class="ml-2">{scale * index}-{scale * index + scale-1} km/h</p>
	  </div>
	{/each}
  </div>
  