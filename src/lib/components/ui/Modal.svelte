<script lang="ts">
	export let title = 'Title';
	export let icon = 'fa-solid fa-diamond';
	export let bgColor = 'bg-white';
	export let closeModal: Function;
</script>

<div class="fixed top-0 left-0 z-40 w-screen h-screen overflow-hidden bg-overlay">
	<div class="flex flex-col p-16 max-h-4/5">
		<div class="flex flex-row justify-between bg-dark bg-grid px-8 py-4">
			<div class=" flex flex-row gap-2 align-middle ">
				<i class={`${icon}  my-auto`} />
				<p class="text-subtitle my-auto">{title}</p>
			</div>
			<button class="btn btn-selected" on:click={() => closeModal()}>
				<i class="fa-solid fa-xmark" />
			</button>
		</div>

		<div class="{bgColor} p-8">
			<slot />
		</div>
	</div>
</div>
