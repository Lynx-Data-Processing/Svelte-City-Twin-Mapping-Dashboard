<script lang="ts">
	export let isOpen: boolean = false;
	export let handleClose: () => void;
</script>

{#if isOpen}
	<div class="fixed flex z-[50] h-full w-full">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="absolute z-[50] bg-black bg-opacity-80 h-full w-full" on:click={handleClose} />
		<div class="my-auto z-[60] mx-auto h-fit w-[32rem] bg-white rounded-md">
			<slot />
		</div>
	</div>
{/if}
