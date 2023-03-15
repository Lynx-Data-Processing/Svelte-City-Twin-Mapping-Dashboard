<script lang="ts">
	import {
		pingMachineLearningAPI,
		processVideoWithMachineLearning
	} from '$lib/service/machinelearning-api';
	import type { selectedPOIType, videoType } from '$lib/types/eventTypes';

	export let selectedPOI: selectedPOIType | null = null;
	export let videoArray: videoType[];

	let processingVideo: boolean = false;
	let processedVideoUrl: string = '';

	const updateVideoUrl = async () => {
		try {
			if (!selectedPOI) return;
			const videos = videoArray.filter((o) => o.eventId === selectedPOI?.data.EventId);
			const tempSelectedVideo = videos.length ? videos[0] : null;
			if (!tempSelectedVideo || !tempSelectedVideo.videoUrl) return;
			processedVideoUrl = tempSelectedVideo.videoUrl;

			const machineLearningAPIStatus = await pingMachineLearningAPI();
			if (!machineLearningAPIStatus) {
				processedVideoUrl = tempSelectedVideo.videoUrl;
			}else{
				processingVideo = true;
				
				const localProcessedVideoUrl = await processVideoWithMachineLearning(tempSelectedVideo);
				processedVideoUrl = localProcessedVideoUrl ?? tempSelectedVideo.videoUrl;

				processingVideo = false;
			}
		

			
		} catch (e) {
			console.log(e);
		}
	};

	

	$: selectedPOI && updateVideoUrl();
</script>

<div class="flex flex-col gap-4">
	{#if selectedPOI && processedVideoUrl}
		<div class="video-container relative">
			
			<video
			class="w-full overflow-hidden "
			controls
			height="100%"
			width="100%"
			title={`processedVideoUrl`}
			src={processedVideoUrl}
			><track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
		</video>
			{#if processingVideo}
				<div
					class="absolute top-0 z-10 map-state map-state-loading configurable-application--loading h-96"
				/>
	
			{/if}
		</div>

		
	{:else}
		<div class="alert alert-error my-1" role="alert">No Video selected.</div>
	{/if}
</div>
