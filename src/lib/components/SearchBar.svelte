<script lang="ts">
	export let placeholder: string = 'Search...';
	export let onChangeFunction: () => void;
	export let search: string = '';
</script>

<input
	type="search"
	bind:value={search}
	required
	class="flex flex-row gap-2 px-4 py-2 border-[1px] h-10 bg-white hover:bg-smoke w-full  text-sm rounded-md"
	{placeholder}
	on:input={() => onChangeFunction()}
/>
