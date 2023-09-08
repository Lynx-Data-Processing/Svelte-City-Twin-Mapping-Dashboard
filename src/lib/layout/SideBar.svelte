<script>
	import LogoutButton from "$lib/features/auth/components/LogoutButton.svelte";

</script>
<div class="bg-dark navbar flex flex-col z-20">
	<slot />

	<LogoutButton/>
</div>
