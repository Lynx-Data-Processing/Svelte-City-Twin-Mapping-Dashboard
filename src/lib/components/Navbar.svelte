<script>
	import { LOGOUT, USARS_GIS } from '$lib/constants/strings';
</script>

<div class="bg-dark bg-topography navbar">
	<div class="bg-overlay flex flex-row justify-between px-8 h-full">
		<div class=" flex flex-row gap-2 align-middle ">
			<i class="fa-solid fa-xl fa-location-arrow my-auto" />
			<p class="text-subtitle my-auto">{USARS_GIS}</p>
		</div>

		<form action="/logout" method="POST" class="">
			<button type="submit" class="btn  btn-primary btn-no-rounded h-full">
				<span><i class="fa-solid fa-right-from-bracket " />{LOGOUT}</span>
			</button>
		</form>
	</div>
</div>
