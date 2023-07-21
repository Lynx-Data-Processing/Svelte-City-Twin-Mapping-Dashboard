<script lang="ts">
	import { slide } from 'svelte/transition';
	export let title = 'Title';
	export let icon = 'fa-solid fa-diamond';
	export let isRounded = false;
	export let bgColor = "bg-white"
	export let closeModal: Function;

</script>

<div class="modal bg-overlay "  >
	<div class="modal-content relative {bgColor} {isRounded ? 'rounded-md' : ''}">
		<div class="flex flow-row justify-between bg-dark bg-grid px-4 py-2 ">
			<div class=" flex flex-row gap-2 align-middle  px-4">
				<i class={`${icon}  icon-color my-auto`} />
				<p class="text-subtitle my-auto">{title}</p>
			</div>

			<button class="btn btn-primary" on:click={()=>closeModal()}>
				<i class="fa-solid fa-xmark" />
			</button>
		</div>

		<div class="modal-body h-[calc(100vh-10rem)] p-8 overflow-auto" >
			<slot />
		</div>
	</div>
</div>
