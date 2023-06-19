<script lang="ts">
	import { slide } from 'svelte/transition';
	export let title = 'Title';
	export let icon = 'fa-solid fa-diamond';
	export let isRounded = false;
	export let isModalOpen = false;
	export let bgColor = "bg-white"

	const hideModal = () => isModalOpen = false;
</script>

<div class="modal {isModalOpen ? '' : 'hidden'} bg-overlay " transition:slide>
	<div class="modal-content relative {bgColor} {isRounded ? 'rounded-md' : ''}">
		<div class="modal-title  flex flex-row justify-between  bg-dark bg-grid">
			<div class=" flex flex-row gap-2 align-middle  px-4">
				<i class={`${icon}  icon-color my-auto`} />
				<p class="text-subtitle my-auto">{title}</p>
			</div>

			<button class="btn btn-primary" on:click={hideModal}>
				<i class="fa-solid fa-xmark" />
			</button>
		</div>

		<div class="modal-body" transition:slide>
			<slot />
		</div>
	</div>
</div>
