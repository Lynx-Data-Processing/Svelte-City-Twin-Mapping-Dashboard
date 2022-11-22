<script>
	import { onMount } from 'svelte/internal';
	import { onDestroy } from 'svelte';

	export let pointOfInterest;
	let streetViewObject = null;
	let streetViewContainer = null;
	let error = null;

	const initializeStreetView = () => {
		try {
			// @ts-ignore
			streetViewObject = new google.maps.StreetViewPanorama(streetViewContainer, {
				position: pointOfInterest,
				pov: {
					heading: 34,
					pitch: 10
				}
			});
		} catch (err) {
			error = err;
		}
	};
	onMount(() => {
		try {
			if (pointOfInterest !== null) {
				initializeStreetView();
			}
		} catch (err) {
			error = err;
		}
	});
	// When the location changes, set the new lat long to the map
	const onLocationChange = () => {
		try {
			streetViewObject === null
				? initializeStreetView()
				: streetViewObject.setPosition(pointOfInterest);
		} catch (err) {
			error = err;
		}
	};
	$: pointOfInterest && onLocationChange();
	onDestroy(() => {
		try {
			streetViewObject = null;
			streetViewContainer = null;
		} catch (e) {}
	});

	let showTerms = true;
	const toggleTerms = () => {
		showTerms = !showTerms;
	};
</script>

<section class="card h-fit scale-in-center p-4">
	<div class="flex flow-row justify-between my-1">
		<div>
			<p>Street View:</p>
		</div>

		<div>
			<button on:click={toggleTerms} class=" text-center hover:underline">
				{#if showTerms}
					<i class="fa-solid fa-arrow-up" />
					<span>Hide</span>
				{:else}
					<i class="fa-solid fa-arrow-down" />
					<span>Show</span>
				{/if}
			</button>
		</div>
	</div>

	{#if showTerms}
		{#if pointOfInterest == null}
			<div class="alert alert-red my-1" role="alert">Select a point on the map.</div>
		{/if}
		{#if error !== null}
			<div class="alert alert-red my-1" role="alert">{error}</div>
		{/if}
		<div
			bind:this={streetViewContainer}
			class={`${pointOfInterest == null ? 'h-0' : 'h-96'} w-full rounded-lg`}
		/>
	{/if}
</section>
