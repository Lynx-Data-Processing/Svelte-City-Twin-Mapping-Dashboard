<script lang="ts">
	export let placeholder: string = 'Search...';
	export let onChangeFunction: () => void;
	export let search: string = '';
</script>

<input bind:value={search} type="text" class="px-4 py-2 w-full border-[1px] rounded-md" placeHolder={placeholder} on:input={() => onChangeFunction()}/>