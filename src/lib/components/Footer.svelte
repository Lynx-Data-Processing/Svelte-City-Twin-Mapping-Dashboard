<script lang="ts">
	import { getDevicon } from '$lib/utils/devicon-icons';
	const PROGRAMMING_TOOLS = ['svelte', 'nodejs', 'csharp','nginx', 'docker', 'googlecloud'];
</script>

<footer class="mt-auto bg-dark bg-topography ">
	<div class="py-16 px-8 bg-overlay">
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
			<div class="col-span-1">
				<div class="flex flex-row gap-2 align-middle">
					<i class="fa-solid fa-2x fa-location-arrow" />
					<p class="text-title my-auto">USARS GIS</p>
				</div>
				<p class="text-sm my-2 ">
					The City promotes and fosters open government principles of participation, innovation,
					transparency and accountability. The data catalogue supports these principles and is the
					first step in making it easier to view, obtain and use the information the City has
					gathered.
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
