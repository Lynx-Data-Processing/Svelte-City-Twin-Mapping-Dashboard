<script lang="ts">
	import { USARS_DISCLAIMER, USARS_GIS } from '$lib/constants/strings';
	import { getDevicon } from '$lib/utils/devicon-icons';
	const PROGRAMMING_TOOLS = ['svelte', 'nodejs', 'csharp','nginx', 'docker', 'googlecloud'];
</script>

<footer class="mt-auto bg-dark bg-topography ">
	<div class="py-16 px-8 bg-overlay">
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
			<div class="col-span-1">
				<div class=" flex flex-row gap-2 align-middle ">
					<i class="fa-solid fa-xl fa-location-arrow my-auto" />
					<p class="text-subtitle my-auto">{USARS_GIS}</p>
				</div>
				<p class="text-sm my-2 ">
					{USARS_DISCLAIMER}
				</p>
			</div>

			<div class="col-span-1" />

			<div class="col-span-1 text-right">
				<div class="flex flex-wrap justify-end">
					{#each PROGRAMMING_TOOLS as tool}
						<img
							height="100"
							width="auto"
							title={tool}
							class={`img-icon img-icon-color w-8 mx-2 py-2`}
							alt={tool}
							src={getDevicon(tool)}
							loading="lazy"
						/>
					{/each}
				</div>
			</div>
		</div>
	</div>
</footer>
