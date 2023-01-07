<script lang="ts">
	export let title: string;
	export let width = 'w-[32rem]';
	let showTerms = false;
	const toggleTerms = () => {
		showTerms = !showTerms;
	};
</script>

<section class="card h-fit slide-in-left {width} p-4">
	<div class="flex flow-row justify-between my-1">
		<div>
			<p>{title}</p>
		</div>

		<div>
			<button on:click={toggleTerms} class="toggle-btn text-center hover:underline">
				{#if showTerms}
					<i class="fa-solid fa-arrow-up" />
					<span>Hide</span>
				{:else}
					<i class="fa-solid fa-arrow-down" />
					<span>Show</span>
				{/if}
			</button>
		</div>
	</div>

	{#if showTerms}
		<slot />
	{/if}
</section>
