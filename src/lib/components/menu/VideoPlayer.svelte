<script lang="ts">
	import { PUBLIC_GCP_BUCKET_URL } from '$env/static/public';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import { getVideo } from '$lib/service/smarter-api';
	import type { ISelectedPOIType, IVideoType } from '$lib/types/eventTypes';
	
	export let selectedPOI: ISelectedPOIType | null = null;
	let video: IVideoType;

	let loadingVideo: boolean = false;
	let processedVideoUrl: string = '';
	const updateVideoUrl = async () => {
		try {

			if (!selectedPOI) return;
			loadingVideo = true;
			
			const useGCP = true;
			if (useGCP) {
				processedVideoUrl =  `${PUBLIC_GCP_BUCKET_URL}/${selectedPOI.data.DeviceId}/${selectedPOI.data.DeviceId}-${selectedPOI.data.EventId}.mp4`;
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
				<LoadingSpinner />
			{/if}
		</div>
	{:else}
		<div class="alert alert-error my-1" role="alert">No GPS selected.</div>
	{/if}
</div>
