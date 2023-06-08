<script lang="ts"> 
    export let numberOfButtons: number;
    export let selectedButtonIndex: number;
    export let setSelectedIndex: Function;

</script>


<div class="flex flex-row justify-between mt-4">
	
	<div class="flex items-center gap-2 mt-2">
		<button
			disabled={selectedButtonIndex === 0}
			on:click={() => setSelectedIndex(selectedButtonIndex - 1)}
			class="paginated-btn btn-gray"
		>
			<i class="fa-solid fa-angle-left" />
		</button>
		{#each Array(numberOfButtons) as _, index (index)}
			<button
				on:click={() => setSelectedIndex(index)}
				class={`paginated-btn ${selectedButtonIndex === index ? 'paginated-btn-primary ' : 'btn-gray'}`}
			>
				{index}
			</button>
		{/each}
		<button
			disabled={selectedButtonIndex === numberOfButtons - 1}
			on:click={() => setSelectedIndex(selectedButtonIndex + 1)}
			class="paginated-btn btn-gray"
		>
			<i class="fa-solid fa-angle-right" />
		</button>
	</div>
</div>
