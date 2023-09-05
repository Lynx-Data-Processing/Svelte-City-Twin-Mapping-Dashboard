<script lang="ts">
	import { USARS_DISCLAIMER, USARS_GIS } from '$lib/constants/strings';
	import { getDevicon } from '$lib/utils/devicon-icons';
	const PROGRAMMING_TOOLS: string[] = [
		'svelte',
		'nodejs',
		'csharp',
		'nginx',
		'docker',
		'googlecloud'
	];
</script>

<footer class="z-50 bg-dark text-white shadow-lg py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 px-8">
	<div class="col-span-1 ">
		<div class="flex flex-col gap-2 ">
			<p class="text-title my-auto">{USARS_GIS}</p>
			<p class="text-sm mt-2">
				{USARS_DISCLAIMER}
			</p>
		</div>
		<div class="flex flex-row gap-2 mt-8">
			<div class="w-4 h-4 bg-primary" />
			<div class="w-4 h-4 bg-purple-500" />
			<div class="w-4 h-4 bg-green-500" />
			<div class="w-4 h-4 bg-yellow-500" />
			<div class="w-4 h-4 bg-red-500" />
		</div>
	</div>
	<div class="col-span-1" />
	<div class="col-span-1 ">
		<p class="text-title">Tools</p>
		<div class="flex flex-row w-fit mt-2">
			{#each PROGRAMMING_TOOLS as tool}
				<img
					height="100"
					width="auto"
					title={tool}
					class={`w-6 mx-2 py-2`}
					alt={tool}
					src={getDevicon(tool)}
					loading="lazy"
				/>
			{/each}
		</div>
	</div>
</footer>
