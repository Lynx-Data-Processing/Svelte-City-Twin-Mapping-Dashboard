<script lang="ts">
	import { EMERGENCY_RECORD, STOP_SIGN, TAILGATING_GPS } from '$lib/constants/strings';
</script>

<div class="flex flex-col gap-2 px-4 py-4">
	<p>
		Filters for all trips and events go here. Each layer should have a checkbox/ sliders to toggle
		Geojson features.
	</p>

	<h2>Trip Filters</h2>
	<ul class="list-disc pl-2">
		<li>Slider for Trip Distance</li>
		<li>Slider for Trip Duration (1hr, 2hr, 3hr, etc.)</li>
		<li>Slider for Average Trip Speed in Km/h</li>
		<li>Toggle for if Trip status ended or not</li>
	</ul>

	<h2>Event Filters</h2>
	<ul class="list-disc pl-2">
		<li>Toggle for Event Trigger Name {TAILGATING_GPS}, {STOP_SIGN}, {EMERGENCY_RECORD}</li>
		<li>Slider for Average Event Speed in Km/h</li>
	</ul>
</div>
