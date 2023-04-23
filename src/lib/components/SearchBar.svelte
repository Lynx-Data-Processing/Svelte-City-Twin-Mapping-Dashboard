<script lang="ts">
	export let onChangeFunction: Function;
	export let searchText: String;
	export let placeholder = 'Search';

	const clearSearch = () => {
		searchText = '';
		onChangeFunction();
	};
</script>

<label for="default-search" class="sr-only">Search</label>
<div class="h-full w-full relative ">
	<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
		<svg
			aria-hidden="true"
			class="w-5 h-5 "
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/></svg
		>
	</div>
	<input
		on:change={() => onChangeFunction()}
		type="search"
		id="default-search"
		class="block w-full p-4 pl-10  border   focus:ring-blue-500 focus:border-blue-500  "
		placeholder={placeholder}
		bind:value={searchText}
		required
	/>
</div>

<button on:click={() => clearSearch()} class="btn btn-black-outline w-16 btn-text-center"
	><i class="fa-solid fa-trash " /></button
>
