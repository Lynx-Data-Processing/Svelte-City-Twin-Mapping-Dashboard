<script lang="ts">
	export let paginationFrom: number;
	export let paginationTo: number;
	export let paginationPage: number;
	export let totalNumberOfItems: number;
	export let numberOfPages: number;
	export let setPaginationPage: Function;
</script>

<div class="flex flex-col">
	<p>{`${paginationFrom + 1}-${paginationTo} of ${totalNumberOfItems}`}</p>
	<div class="flex items-center gap-2 mt-2">
		<button
			disabled={paginationPage === 0}
			on:click={() => setPaginationPage(paginationPage - 1)}
			class="px-4 py-2  btn-gray-sm"
		>
			Previous
		</button>
		{#each Array(numberOfPages) as _, index (index)}
			<button
				on:click={() => setPaginationPage(index)}
				class={`px-4 py-2 ${
					paginationPage === index ? 'btn-pagination-primary-sm font-bold ' : 'btn-gray-sm'
				}`}
			>
				{index}
			</button>
		{/each}
		<button
			disabled={paginationPage === numberOfPages - 1}
			on:click={() => setPaginationPage(paginationPage + 1)}
			class="px-4 py-2  btn-gray-sm "
		>
			Next
		</button>
	</div>
</div>
