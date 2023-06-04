<script lang="ts">
	export let title = 'Error';
	export let message: string = 'Unable to load data';
</script>

<div class="absolute top-0 z-10 load load-error h-full w-full">
	<div class="flex flex-col items-center justify-center h-full">
		<i class="fa-solid fa-exclamation-circle text-4xl " />
		<h1 class="text-2xl ">{title}</h1>
		<p class="text-center ">{message}</p>
	</div>
</div>
