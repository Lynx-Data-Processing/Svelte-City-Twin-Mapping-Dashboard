<script lang="ts">
	import { getDevicon } from '../utils/devicon-icons';

	const PROGRAMMING_TOOLS = [
		'nextjs',
		'svelte',
		'nodejs',
		'express',
		'nginx',
		'github',
		'docker',
		'googlecloud'
	];
</script>

<footer class="bg-smoke  py-8 px-8">
	<div class="grid grid-cols-1 sm:grid-cols-3 ">
		<div class="col-span-1">
			<p>© USARs. All rights reserved.</p>
			<p class="text-xs my-2">Website Terms and Policies</p>

			<p class="text-xs my-2">
				The City promotes and fosters open government principles of participation, innovation,
				transparency and accountability. The data catalogue supports these principles and is the
				first step in making it easier to view, obtain and use the information the City has
				gathered.
			</p>
		</div>

		<div class="col-span-1 py-2 " />

		<div class="col-span-1">
			<p>License Terms</p>

			<p class="text-xs my-2">
				Application uses MAPBOX to display Geojson data. Interactive, thoroughly customizable maps
				in the browser, powered by vector tiles and WebGL.
			</p>

			<div class="flex flex-wrap ">
				{#each PROGRAMMING_TOOLS as tool}
					<img
						height="100"
						width="auto"
						title={tool}
						class={`img-icon w-8 mx-2 py-2`}
						alt=""
						src={getDevicon(tool)}
						loading="lazy"
					/>
				{/each}
			</div>
		</div>
	</div>
</footer>
