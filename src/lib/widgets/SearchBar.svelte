<script lang="ts">
	export let title: string = '';
	export let placeholder: string = 'Search...';
	export let onChangeFunction: Function;
	export let search: string = '';
</script>

<div class="flex flex-row gap-4 w-full">
	{#if title}
		<p class="text-title">{title}</p>
	{/if}
	<div class="search-container flex-1 ">
		<input
			type="search"
			bind:value={search}
			required
			class="search-input"
			{placeholder}
			on:input={() => onChangeFunction()}
		/>
		<i class="fas fa-search search-icon" />
	</div>
</div>
