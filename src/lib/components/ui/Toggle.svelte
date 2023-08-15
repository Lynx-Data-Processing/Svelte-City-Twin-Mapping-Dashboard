<script lang="ts">
	export let numberOfButtons: number;
	export let selectedButtonIndex: number;
	export let setSelectedIndex: Function;
</script>

<div class="flex items-center gap-2">
	{#each Array(numberOfButtons) as _, index (index)}
		<button
			on:click={() => setSelectedIndex(index)}
			class={`btn ${selectedButtonIndex === index ? 'btn-selected ' : 'btn-gray'}`}
		>
			<span>{index + 1}</span>
		</button>
	{/each}
</div>
