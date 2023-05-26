

<script lang="ts">
	let search: string = '';
	export let placeholder: string = 'Search...';
	export let onChangeFunction: Function;

	const clearSearch = () => {
		search = '';
		onChangeFunction();
	};
</script>

<label for="default-search" class="sr-only">Search</label>
<div class="h-full w-full relative ">
	<div class="absolute  inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
		<svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
			<path
				fill-rule="evenodd"
				d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>
	<input
		on:change={() => onChangeFunction(search)}
		type="search"
		id="default-search"
		class="block w-full p-4 pl-10  border   focus:ring-blue-500 focus:border-blue-500  rounded-lg"
		placeholder={placeholder}
		bind:value={search}
		required
	/>
</div>

<button on:click={() => clearSearch()} class="btn btn-black-outline w-16 btn-text-center"
	><i class="fa-solid fa-trash " /></button
>
