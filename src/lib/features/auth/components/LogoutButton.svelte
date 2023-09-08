<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	let isModalOpen = false;
	const handleFormLogout = () => {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '/logout';

		// Append the form to the document
		document.body.appendChild(form);

		// Submit the form
		form.submit();
	};
</script>

<Modal isOpen={isModalOpen} handleClose={()=>{isModalOpen=false}}>
	<div class="flex flex-row gap-2  bg-dark text-white px-4 py-3">
		<i class="fa-solid fa-location-arrow my-auto" />
		<p class="text-subtitle my-auto">Logout</p>
	</div>

	<div class="flex flex-row gap-2 bg-white p-4">
		<button class="bg-primary hover:bg-primary-dark text-white p-2 w-full h-10 rounded-md" on:click={()=>{isModalOpen=false}}>
			<p>Cancel Logout</p>
		</button>

		<button
			on:click={handleFormLogout}
			title="Search"
			class="bg-dark hover:bg-zinc-800 text-white p-2 w-full h-10 rounded-md"
		>
			<p>Logout</p>
		</button>
	</div>
</Modal>

<button
	on:click={() => {
		isModalOpen = true;
	}}
	title="Logout"
	type="submit"
	class="bg-dark hover:bg-zinc-800 text-white p-2 w-full h-12 mt-auto"
>
	<i class="fa-solid fa-right-from-bracket " />
</button>
