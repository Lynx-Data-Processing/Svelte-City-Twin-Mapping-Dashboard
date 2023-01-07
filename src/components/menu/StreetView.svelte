<script>
	import { onDestroy } from 'svelte';
	import { onMount } from 'svelte/internal';

	let streetViewObject = null;
	let streetViewContainer = null;

	const initializeStreetView = (poi) => {
		try {
			streetViewObject = new google.maps.StreetViewPanorama(streetViewContainer, {
				position: poi,
				pov: {
					heading: 34,
					pitch: 10
				}
			});
		} catch (error) {
			console.error(error);
		}
	};

	const updateStreetView = (poi) => {
		try {
			if (streetViewObject === null) {
				initializeStreetView(poi);
			} else {
				streetViewObject.setPosition(poi);
			}
		} catch (error) {
			console.error(error);
		}
	};

	export let selectedPOI;

	onMount(() => {
		if (selectedPOI !== null) {
			initializeStreetView(selectedPOI);
		}
	});

	$: selectedPOI && updateStreetView(selectedPOI);

	onDestroy(() => {
		try {
			streetViewObject = null;
			streetViewContainer = null;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<div class="flex flex-col">
	{#if selectedPOI == null}
		<div class="alert alert-red my-1" role="alert">Select a point on the map.</div>
	{/if}
	<div
		bind:this={streetViewContainer}
		class={`${selectedPOI == null ? 'h-0' : 'h-96'} w-full rounded-lg`}
	/>
</div>
