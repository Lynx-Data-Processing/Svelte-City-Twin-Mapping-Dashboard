<script lang="ts">
	import type { IFooterElementType } from '$lib/types/types';
	import { getDevicon } from '$lib/utils/devicon-icons';

	const PROGRAMMING_TOOLS = ['nodejs', 'express', 'nginx', 'github', 'docker', 'googlecloud'];

</script>

<footer class="mt-auto bg-smoke py-8 px-8 ">
	

	<div class="grid grid-cols-1 sm:grid-cols-3 py-8">
		<div class="col-span-1 py-2">
			<div class="flex flex-row gap-2 align-middle">
				<i class="fa-solid fa-2x fa-location-arrow" />
				<p class="text-title my-auto">USARS GIS</p>
		
			</div>
			<p class="text-sm my-2">
				The City promotes and fosters open government principles of participation, innovation,
				transparency and accountability. The data catalogue supports these principles and is the
				first step in making it easier to view, obtain and use the information the City has
				gathered.
			</p>
		</div>

		<div class="col-span-1 py-2 " />

		<div class="col-span-1 py-2">
			<p class="text-title my-auto">Terms</p>

			<p class="text-sm my-2">
				Application uses MAPBOX to display Geojson data. Interactive, thoroughly customizable maps
				in the browser, powered by vector tiles and WebGL. Mapbox is a location data platform for
				mobile and web applications. We provide building blocks to add location features like maps,
				search, and navigation into any experience you create.
			</p>

			<div class="flex flex-wrap ">
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
</footer>
