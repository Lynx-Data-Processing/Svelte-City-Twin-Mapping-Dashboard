<script>
	import { page } from '$app/stores';
</script>

<div class="bg-red-500 text-white h-screen">
	<div class="py-16  flex flex-col gap-4 text-center justify-center h-full">
		<p class="text-subtitle">{$page.status}: {$page.error?.message}</p>
		<p class="text-2xl font-bold">ERROR</p>
		<p>Welcome to the backrooms. Nothing exists here.</p>
	</div>
</div>
