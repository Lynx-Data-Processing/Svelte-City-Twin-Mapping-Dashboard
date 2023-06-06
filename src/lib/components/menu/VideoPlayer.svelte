<script lang="ts">
	import { PUBLIC_GCP_BUCKET_URL } from '$env/static/public';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import { getVideo } from '$lib/service/smarter-api';
	import type { IMediaRecordingType, ITripEventWithSensorDataType } from '$lib/types/eventTypes';
	import { millisecondUnixToDateTime } from '$lib/utils/date-format';
	import { formatText } from '$lib/utils/text-format';
	import ButtonList from '../ButtonList.svelte';
	import Underline from '../Underline.svelte';
	import PaginationButtons from '../table/PaginationButtons.svelte';

	export let selectedEvent: ITripEventWithSensorDataType | null = null;
	let videos: IMediaRecordingType[];

	let loadingVideo: boolean = false;

	let selectedVideo: IMediaRecordingType | null = null;

	let selectedVideoIndex = 0;
	let numberOfVideos = 0;

	const getAllVideos = async () => {
		try {
			if (!selectedEvent) return;
			loadingVideo = true;
			selectedVideoIndex = 0;

			let tempVideos = await getVideo(selectedEvent);
			numberOfVideos = tempVideos.length;

			videos = tempVideos;
			selectedVideo = tempVideos[0];
			console.log(tempVideos);
			loadingVideo = false;
		} catch (e) {
			console.log(e);
		}
	};

	const setSelectedVideoIndex = (index: number) => {
		if (index < 0) {
			selectedVideoIndex = 0;
		} else if (index >= numberOfVideos) {
			selectedVideoIndex = numberOfVideos - 1;
		} else {
			selectedVideoIndex = index;
		}

		setSelectedVideo();
	};

	const setSelectedVideo = () => {
		if (!videos) return;
		selectedVideo = videos[selectedVideoIndex];
	};

	$: selectedEvent && getAllVideos();
</script>

<div class="flex flex-col">
	{#if selectedEvent}
		<div class="relative h-fit">
			<video
				autoplay={true}
				class="w-full h-auto overflow-hidden "
				controls
				height="100%"
				width="100%"
				title={`processedVideoUrl`}
				src={selectedVideo?.url}
				><track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
			</video>
			{#if loadingVideo}
				<LoadingSpinner />
			{/if}
		</div>

		<ButtonList
			numberOfButtons={numberOfVideos}
			selectedButtonIndex={selectedVideoIndex}
			setSelectedIndex={setSelectedVideoIndex}
		/>

		{#if selectedVideo}
			<div class="flex flex-col py-4">
				<p class="text-subtitle uppercase">Details</p>
				<div class="pt-2"><Underline /></div>

				<p>
					<span class="font-bold">Endpoint Name</span>: {formatText(selectedEvent.endpointName)}
				</p>
				<p>
					<span class="font-bold">Recording Start</span>: {selectedVideo?.startTimestamp
						? millisecondUnixToDateTime(selectedVideo.startTimestamp)
						: 'N/A'}
				</p>

				<p>
					<span class="font-bold">Recording End</span>: {selectedVideo?.endTimestamp
						? millisecondUnixToDateTime(selectedVideo.endTimestamp)
						: 'N/A'}
				</p>
				<p><span class="font-bold">Source</span>: {formatText(selectedVideo.source)}</p>
				<p><span class="font-bold">Type</span>: {formatText(selectedVideo.type)}</p>
				<p><span class="font-bold">Trigger Name</span>: {formatText(selectedEvent.triggerName)}</p>

				<div class="flex flex-row gap-2 mt-2">
					<i class="fa-sharp fa-2x fa-solid fa-car-side"></i>
					<i class="fa-solid fa-video {selectedVideo.source === "vid_2" ? "fa-rotate-180 mb-4" : ""}"></i>
				</div>
				
			</div>
		{/if}
	{:else}
		<div class="alert alert-error my-1" role="alert">No GPS selected.</div>
	{/if}
</div>
