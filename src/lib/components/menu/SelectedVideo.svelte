<script lang="ts">
	import {
		pingMachineLearningAPIWithAxios,
		processVideoWithMachineLearning
	} from '$lib/service/machinelearning-api';
	import { getVideo } from '$lib/service/smarter-api';
	import type { ISelectedPOIType, IVideoType } from '$lib/types/eventTypes';
	import { onMount } from 'svelte';
	import MapLoadingSpinner from '../map/MapLoadingSpinner.svelte';

	export let selectedPOI: ISelectedPOIType | null = null;
	let video: IVideoType;

	let loadingVideo: boolean = false;
	let processedVideoUrl: string = '';

	// videoArray = await getVideosFromGpsData(tempGpsData);

	onMount(async () => {
		if (selectedPOI) {
			await updateVideoUrl();
		}
	});

	const updateVideoUrl = async () => {
		try {
			if (!selectedPOI) return;
			loadingVideo = true;
			video = await getVideo(selectedPOI.data);

			const machineLearningAPIStatus = await pingMachineLearningAPIWithAxios();
			if (machineLearningAPIStatus) {
				const localProcessedVideoUrl = await processVideoWithMachineLearning(
					video.eventId,
					video.deviceId,
					video.videoUrl
				);
				processedVideoUrl = localProcessedVideoUrl ?? video.videoUrl;
			} else {
				processedVideoUrl = video.videoUrl;
			}
			loadingVideo = false;
		} catch (e) {
			console.log(e);
		}
	};

	$: selectedPOI && updateVideoUrl();
</script>

<div class="flex flex-col gap-4">
	{#if selectedPOI}
		<div class="video-container relative">
			<video
				autoplay={true}
				class="w-full overflow-hidden "
				controls
				height="100%"
				width="100%"
				title={`processedVideoUrl`}
				src={processedVideoUrl}
				><track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
			</video>
			{#if loadingVideo}
		
				<MapLoadingSpinner />
			{/if}
		</div>
	{:else}
		<div class="alert alert-error my-1" role="alert">No GPS selected.</div>
	{/if}
</div>
