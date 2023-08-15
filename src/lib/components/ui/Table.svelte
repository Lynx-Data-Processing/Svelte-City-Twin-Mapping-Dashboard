<script lang="ts">
	export let bgColor = '#00000';
	export let columns: string[] = [];
	export let data: string[][] = [];

	let sortDirection: 'asc' | 'desc' | null = null;
	let sortedByColumn: string | null = null;

	function sortTable(columnIndex: number) {
		if (sortedByColumn === columns[columnIndex]) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortedByColumn = columns[columnIndex];
			sortDirection = 'asc';
		}

		const tempData = [...data];
		const sortedTempData = tempData.sort((a, b) => {
			if (a[columnIndex] < b[columnIndex]) return sortDirection === 'asc' ? -1 : 1;
			if (a[columnIndex] > b[columnIndex]) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
		data = sortedTempData;
	}
</script>

<table class="w-full table text-gray-500">
	<thead class="text-white " style="background-color: {bgColor};">
		<tr>
			{#each columns as key, idx}
				<th>
					<div class="text-left py-2 px-6 flex flex-row justify-between items-center">
						<p class="text-subtitle ">{key}</p>
						<button
							on:click={() => sortTable(idx)}
							class="ml-4 btn btn-sm"
						>
							{#if sortedByColumn === key && sortDirection === 'asc'}
								<i class={`fa-solid fa-arrow-up `} />
							{:else}
								<i class={`fa-solid fa-arrow-down `} />
							{/if}
						</button>
					</div>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each data as row, idx}
			<tr class="border-b border-gray-200  {idx % 2 ? 'bg-gray-100' : 'bg-white '}  hover:bg-gray-300">
				{#each row as value, vdx}
					<td class="py-2 px-6 {vdx == 0 ? 'text-black ' : ''}"><p class="text-subtitle ">{value}</p></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
