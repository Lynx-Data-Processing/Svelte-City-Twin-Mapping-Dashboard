<script>
	import { onMount } from 'svelte/internal';
	import { onDestroy } from 'svelte';

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

	const onLocationChange = (poi) => {
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

	$: selectedPOI && onLocationChange(selectedPOI);

	onDestroy(() => {
		try {
			streetViewObject = null;
			streetViewContainer = null;
		} catch (error) {
			console.error(error);
		}
	});
</script>

<section class="card h-fit slide-in-left w-[32rem]">
	{#if selectedPOI == null}
		<div class="p-4">
			<p class="my-1">Street View:</p>
			<div class="alert alert-red my-1" role="alert">Select a point on the map.</div>
		</div>
	{/if}
	<div
		bind:this={streetViewContainer}
		class={`${selectedPOI == null ? 'h-0' : 'h-96'} w-full rounded-lg`}
	/>
</section>
