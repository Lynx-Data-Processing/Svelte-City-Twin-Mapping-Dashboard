<script lang="ts">
	import { processVideoWithMachineLearning } from '../../service/machinelearning-api';
	import type { selectedEventType, videoType } from '../../types/types';

	export let selectedPOI: selectedEventType | null = null;
	export let videoArray: videoType[];
	let videoUrl: string = '';

	let processingVideo: boolean = false;
	let processedVideoUrl: string = '';
	let videoProcessed: boolean = false;

	const updateVideoUrl = async () => {
		try {
			if (!selectedPOI) return;
			const selectedEventId = selectedPOI?.data.EventId;
			const videos = videoArray.filter((o) => o.eventId === selectedEventId);
			videoUrl = videos.length ? videos[0].videoUrl! : '';

			if (videoProcessed) {
				URL.revokeObjectURL(processedVideoUrl);
				processedVideoUrl = '';
				videoProcessed = false;
			}
		} catch (e) {
			console.log(e);
		}
	};

	async function getVideo() {
		try {
			processingVideo = true;
			const localProcessedVideoUrl = await processVideoWithMachineLearning(videoUrl);

			if (localProcessedVideoUrl) {
				processedVideoUrl = localProcessedVideoUrl;
			}

			processingVideo = false;
			videoProcessed = true;
		} catch (error) {
			console.log(error);
		}
	}

	$: selectedPOI && updateVideoUrl();
</script>

<div class="flex flex-col gap-4">
	{#if selectedPOI && videoUrl}
		<div class="video-container relative">
			<video
				class="w-full overflow-hidden rounded-lg"
				controls
				height="100%"
				width="100%"
				title={`processedVideoUrl`}
				src={processedVideoUrl || videoUrl}
				><track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
			</video>

			{#if processingVideo}
				<div
					class="absolute top-0 z-10 map-state map-state-loading configurable-application--loading"
				/>
			{/if}
		</div>

		{#if !videoProcessed && processingVideo == false}
			<button on:click={getVideo} class={`btn w-full btn-black-outline `}> Process Video </button>
		{/if}
	{:else}
		<div class="alert alert-error my-1" role="alert">No Video selected.</div>
	{/if}
</div>
