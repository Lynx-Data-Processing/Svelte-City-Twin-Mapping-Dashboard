<script lang="ts">
	export let title: string;
	export let icon: string;
	export let extraClasses = '';
	export let iconColor = 'black';
	export let size = 'w-12 h-12';
	export let onClickHandle: () => void;
</script>

<button 
	title={title}
	class="bg-white hover:bg-zinc-200 border-[0.5px] rounded-md flex {size} {extraClasses}"
	style="color: {iconColor}"
	on:click={() => onClickHandle()}
>
	<i class="{icon} m-auto" />
</button>
