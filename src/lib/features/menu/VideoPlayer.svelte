<script lang="ts">
	import AlertError from '$lib/components/AlertError.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import type { IEventGoogleDataType } from '$lib/features/map/types/googleTypes';
	import type { IMediaRecordingType } from '$lib/features/menu/types/videoTypes';
	import { getVideo } from '$lib/service/smarter-api';
	import { millisecondUnixToDateTime } from '$lib/utils/date-format';
	import { selectedEventStore } from '../map/store/selectedEventStore';

	let selectedEvent: IEventGoogleDataType | undefined;
	selectedEventStore.subscribe((value) => {
		selectedEvent = value.selectedEvent;
	});

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
			// Get all the videos and Remove any interior view videos
			let tempVideos = await getVideo(selectedEvent);
			tempVideos = tempVideos.filter((video: IMediaRecordingType) => video.source === 'vid_1');
			// Set the video url
			numberOfVideos = tempVideos.length;
			videos = tempVideos;
			selectedVideo = tempVideos[0];
			console.log(selectedEvent);
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
	const getErrorText = () => {
		if (!selectedEvent) return 'No event selected';
		else if (numberOfVideos === 0) return 'No videos found';
		else return 'Error loading videos';
	};
	$: selectedEvent && getAllVideos();
</script>
<div class="flex flex-col relative">
	{#if selectedEvent && numberOfVideos >= 0}
		{#if loadingVideo}
			<div class="p-4 h-64">
				<p>Loading</p>
			</div>
		{:else if numberOfVideos > 0}
			<div class="flex-1 h-64">
				<video
					autoplay={true}
					class="h-64 overflow-hidden rounded-top-md bg-black"
					controls
					height="100%"
					width="100%"
					title={`processedVideoUrl`}
					src={selectedVideo?.url}
					><track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
				</video>
			</div>
			<div class="flex flex-row bg-primary px-4 py-2">
				<p>{selectedEvent.endpointName}</p>
			</div>
			<div class="flex flex-col  justify-between  p-4 gap-2">
				<div>
					<p class="font-bold">Trip Distance</p>
					<p>
						{selectedEvent.distance ? `${(selectedEvent.distance / 1000).toFixed(2)} km` : 'N/A'}
					</p>
				</div>
				<div>
					<p class="font-bold">Trigger</p>
					<p>{selectedEvent.triggerName}</p>
				</div>
				<div class="my-auto">
					<p class="font-bold">Time</p>
					<p>{millisecondUnixToDateTime(selectedEvent.recordingStartTimestamp)}</p>
					<p>{millisecondUnixToDateTime(selectedEvent.recordingEndTimestamp)}</p>
				</div>
			</div>
			<div class="mt-auto px-4  py-4 flex flex-row bg-smoke justify-between">
				<Toggle
					numberOfButtons={numberOfVideos}
					selectedButtonIndex={selectedVideoIndex}
					setSelectedIndex={setSelectedVideoIndex}
				/>
				<button
					class="px-4 py-3 border-2 border-gray-200  transition duration 150 ease-in-out "
					title="Videos are stored in smaller, manageable chunks for optimal performance; use the buttons to select the desired video."
				>
					<i class="fas fa-question-circle " />
				</button>
			</div>
		{:else}
			<div class="p-4">
				<AlertError message={getErrorText()} />
			</div>
		{/if}
	{:else}
		<div class="p-4">
			<AlertError message={getErrorText()} />
		</div>
	{/if}
</div>
