<script lang="ts">
	export let title: string = '';
	export let placeholder: string = 'Search...';
	export let onChangeFunction: Function;
	export let search: string = '';
</script>

<div class="flex flex-row gap-4 w-full">

	<div class="search-container flex-1 ">
		<input
			type="search"
			bind:value={search}
			required
			class="search-input rounded-lg"
			{placeholder}
			on:change={() => onChangeFunction()}
		/>
		<i class="fas fa-search search-icon" />
	</div>

</div>
