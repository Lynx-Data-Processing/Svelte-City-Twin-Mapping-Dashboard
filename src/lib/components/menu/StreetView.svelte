<script>
	import { onDestroy } from 'svelte';
	import { onMount } from 'svelte/internal';
	export let selectedPOI;
	let streetViewObject = null;
	let streetViewDiv = null;

	const initializeStreetView = () => {
		streetViewObject = new google.maps.StreetViewPanorama(streetViewDiv, {
			position: selectedPOI,
			pov: {
				heading: 34,
				pitch: 10
			}
		});
	};

	const updateStreetView = () => {
		if (streetViewObject !== null && selectedPOI) {
			streetViewObject.setPosition(selectedPOI);
		} else {
			initializeStreetView();
		}
	};
	$: selectedPOI && updateStreetView();

	onMount(() => {
		if (selectedPOI) {
			initializeStreetView();
		}
	});

	onDestroy(() => {
		try {
			streetViewObject = null;
			streetViewDiv = null;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<div class="flex flex-col">
	{#if selectedPOI == null}
		<div class="alert alert-error my-1" role="alert">Select a point on the map.</div>
	{/if}
	<div bind:this={streetViewDiv} class={`${selectedPOI? 'h-96' : 'h-0'} w-full `} />
</div>
