<script lang="ts">
	import { LOGOUT, USARS_GIS } from '$lib/constants/strings';

</script>

<div class="bg-dark navbar flex flex-col ">
	<div class="btn btn-primary btn-no-border w-full flex flex-row gap-2  ">
		<i class="fa-solid text-xl fa-location-arrow" aria-hidden="true" />
		<p class="my-auto">{USARS_GIS}</p>
	</div>

	
	<form action="/logout" method="POST" class="mt-auto">
		<button type="submit" class="btn  w-full flex flex-row gap-2 p-4">
			<i class="fa-solid fa-right-from-bracket " />
			<p>{LOGOUT}</p>
		</button>
	</form>
</div>
