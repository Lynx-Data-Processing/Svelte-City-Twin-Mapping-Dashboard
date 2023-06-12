<script lang="ts"> 
    export let numberOfButtons: number;
    export let selectedButtonIndex: number;
    export let setSelectedIndex: Function;

</script>


<div class="flex flex-row justify-between mt-4">
	
	<div class="flex items-center gap-2 mt-2">
	
		{#each Array(numberOfButtons) as _, index (index)}
			<button
				on:click={() => setSelectedIndex(index)}
				class={`paginated-btn ${selectedButtonIndex === index ? 'paginated-btn-primary ' : 'btn-gray'}`}
			>
				{index}
			</button>
		{/each}
		
	</div>
</div>
