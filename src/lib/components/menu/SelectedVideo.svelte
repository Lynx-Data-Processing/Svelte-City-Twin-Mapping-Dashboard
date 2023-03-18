<script lang="ts">
	import { PUBLIC_AWS_BUCKET_URL } from '$env/static/public';
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

	import axios from 'axios';

	async function checkUrlAvailability(url: string) {
		try {
			const response = await axios.get(url);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	const updateVideoUrl = async () => {
		try {
			if (!selectedPOI) return;
			loadingVideo = true;
			
			// Check if in AWS S3 Bucket
			const url = `${PUBLIC_AWS_BUCKET_URL}/${selectedPOI.data.DeviceId}/${selectedPOI.data.DeviceId}-${selectedPOI.data.EventId}.mp4`;
			const isUrlAvailable = await checkUrlAvailability(url);
			if (isUrlAvailable) {
				processedVideoUrl = url;
			} else {
				video = await getVideo(selectedPOI.data);
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
