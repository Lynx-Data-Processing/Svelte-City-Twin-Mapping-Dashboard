<script  lang="ts">
	export let selectedEvent : any;
	export let videoLinks : any[];
	let videoUrl : string = '';


	const updateVideoUrl = async () => {
	
		if(selectedEvent.data.DeviceId === 'CK20520033'){
			videoUrl = `/USARS_Machine_Learning/${selectedEvent.data.EventId}-converted.mp4`;
		}
		else{
			const tempUrl = videoLinks.find(o=>  o.eventId === selectedEvent.data.EventId);
			videoUrl =  tempUrl || '';
		}
	};
	$: selectedEvent && updateVideoUrl();
</script>

<section class="card {selectedEvent ? 'h-96' : 'h-fit'} scale-in-center w-[32rem]">
	{#if selectedEvent && videoUrl}

		<video 
			class="h-96 w-full overflow-hidden rounded-lg"
			controls
			height="100%"
			width="100%"
			title={`${selectedEvent.data.EventId}`}
			src={videoUrl}
		><track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions"> </video>
	{:else}
		<div class="p-4">
			<p class="font-bold my-1">Video Player:</p>
			<div class="alert alert-red my-1" role="alert">No Video selected.</div>
		</div>
	{/if}
</section>
