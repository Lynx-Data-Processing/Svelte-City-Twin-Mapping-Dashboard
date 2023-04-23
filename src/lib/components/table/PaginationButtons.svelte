<script lang="ts">
	export let paginationFrom: number;
	export let paginationTo: number;
	export let paginationPage: number;
	export let totalNumberOfItems: number;
	export let numberOfPages: number;
	export let setPaginationPage: Function;
</script>

<div class="flex flex-row justify-between mt-4">
	<div class="my-auto pl-4">
		<p>{`Showing ${paginationFrom + 1}-${paginationTo} of ${totalNumberOfItems} Entries`}</p>
	</div>

	<div class="flex items-center gap-2 mt-2">
		<button
			disabled={paginationPage === 0}
			on:click={() => setPaginationPage(paginationPage - 1)}
			class="paginated-btn btn-gray"
		>
			<i class="fa-solid fa-angle-left" />
		</button>
		{#each Array(numberOfPages) as _, index (index)}
			<button
				on:click={() => setPaginationPage(index)}
				class={`paginated-btn ${paginationPage === index ? 'paginated-btn-primary ' : 'btn-gray'}`}
			>
				{index}
			</button>
		{/each}
		<button
			disabled={paginationPage === numberOfPages - 1}
			on:click={() => setPaginationPage(paginationPage + 1)}
			class="paginated-btn btn-gray"
		>
			<i class="fa-solid fa-angle-right" />
		</button>
	</div>
</div>
