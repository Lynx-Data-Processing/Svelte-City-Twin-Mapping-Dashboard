<script  lang="ts">

	import { getDevicon } from '../utils/devicon-icons';
	import { ABOUT_LIST, APPLICATION_TOOLS_LIST, DETAILS_LIST, PROGRAMMING_TOOLS } from "../constants";


</script>


<footer class="bg-smoke  py-8 px-8">
	<div class="grid grid-cols-1 md:grid-cols-3 py-2 mb-8">
		<div class="col-span-1 ">
			<p class="font-bold">About</p>

			{#each APPLICATION_TOOLS_LIST as item}
				<div  class="my-2">
					<a href={`${item.link}`} target="_blank" class="text-sm  hover:underline" rel="noreferrer">{item.name}</a>
				</div>
			{/each}
		</div>

		<div class="col-span-1">
			<p class="font-bold">Application Tools</p>
			{#each APPLICATION_TOOLS_LIST as item}
				<div class="my-2">
					<a href={`${item.link}`} target="_blank" rel="noreferrer" class="text-sm  hover:underline">{item.name}</a>
				</div>
			{/each}
		</div>

		<div class="col-span-1 ">
			<p class="font-bold">Details</p>

			{#each APPLICATION_TOOLS_LIST as item}
				<div class="my-2">
					<a href={`${item.link}`} target="_blank" class="text-sm  hover:underline" rel="noreferrer">{item.name}</a>
				</div>
			{/each}
		</div>
	</div>

	<hr />

	<div class="grid grid-cols-1 sm:grid-cols-3 mt-8">
		<div class="col-span-1">
			<p>© USARs. All rights reserved.</p>
			<p class="text-xs my-2">Website Terms and Policies</p>

			<p class="text-xs my-2">
				The City promotes and fosters open government principles of participation, innovation, transparency and accountability. The data catalogue supports these principles and is the first step in
				making it easier to view, obtain and use the information the City has gathered.
			</p>
		</div>

		<div class="col-span-1 py-2 " />

		<div class="col-span-1">
			<p>License Terms</p>

			<p class="text-xs my-2">
				Application uses MAPBOX to display Geojson data. Interactive, thoroughly customizable maps in the browser, powered by vector tiles and WebGL. 
			</p>

			<div class="flex flex-wrap justify-between  ">
				{#each PROGRAMMING_TOOLS as tool}
				<img height="100" width="auto" title={tool}  class={`img-icon w-8 mx-2 py-2`} alt="" src={getDevicon(tool)} loading="lazy" />
				{/each}
	
			</div>
		
		</div>
	</div>
</footer>
