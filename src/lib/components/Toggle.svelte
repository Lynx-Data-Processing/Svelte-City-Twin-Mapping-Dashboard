<script lang="ts">
	export let numberOfButtons: number;
	export let selectedButtonIndex: number;
	export let setSelectedIndex: (value: number) => void;
</script>

<div class="flex items-center gap-2">
	{#each Array(numberOfButtons) as _, index (index)}
		<button
			on:click={() => setSelectedIndex(index)}
			class={`px-4 py-3 border-2 border-gray-200  transition duration 150 ease-in-out  ${selectedButtonIndex === index ? 'bg-primary text-white hover:bg-primary-dark' : ''}`}
		>
			<span>{index + 1}</span>
		</button>
	{/each}
</div>
