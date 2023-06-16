<script lang="ts">
	export let title: string = '';
	export let placeholder: string = 'Search...';
	export let onChangeFunction: Function;
	export let search: string = '';
</script>

<div class="flex flex-col gap-4 w-full">
	{#if title}
		<h5>{title}</h5>
	{/if}

	<div class="search-container ">
		<input
			type="search"
			bind:value={search}
			required
			class="search-input "
			{placeholder}
			on:change={() => onChangeFunction()}
		/>
		<i class="fas fa-search search-icon" />
	</div>
</div>
