<script lang="ts">
	import { PUBLIC_GCP_BUCKET_URL } from '$env/static/public';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import { DISTANCE, TIME, TRIGGER } from '$lib/constants/strings';
	import { getVideo } from '$lib/service/smarter-api';
	import type { IEventGoogleDataType, IMediaRecordingType } from '$lib/types/eventTypes';
	import { millisecondUnixToDateTime } from '$lib/utils/date-format';
	import { formatText } from '$lib/utils/text-format';
	import Toggle from '../Toggle.svelte';
	import Underline from '../Underline.svelte';

	export let selectedEvent: IEventGoogleDataType | null = null;
	let videos: IMediaRecordingType[];

	let loadingVideo: boolean = false;

	let selectedVideo: IMediaRecordingType | null = null;

	let selectedVideoIndex = 0;
	let numberOfVideos = 0;

	const refresh = () => {
		getAllVideos();
	};

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

<div class="flex flex-col  gap-2 relative">
	{#if selectedEvent && numberOfVideos >= 0}
		{#if loadingVideo}
			<div class="p-4 h-64">
				<LoadingSpinner />
			</div>
		{:else if numberOfVideos > 0}
			<div class="flex-1 ">
				<video
					autoplay={true}
					class="h-auto overflow-hidden rounded-top-md"
					controls
					height="100%"
					width="100%"
					title={`processedVideoUrl`}
					src={selectedVideo?.url}
					><track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
				</video>
			</div>

			<div class="flex flex-col px-4 py-4 gap-2">
				<p class="text-subtitle">{selectedEvent.endpointName}</p>

				<Underline />

				<div class="flex flex-row justify-between ">
					<div>
						<p>{DISTANCE}</p>
						<p>
							{selectedEvent.distance ? `${(selectedEvent.distance / 1000).toFixed(2)} km` : 'N/A'}
						</p>
					</div>

					<div>
						<p>{TRIGGER}</p>
						<p>{formatText(selectedEvent.triggerName)}</p>
					</div>

					<div class="my-auto">
						<p>{TIME}</p>
						<p>{millisecondUnixToDateTime(selectedEvent.recordingStartTimestamp)}</p>
						<p>{millisecondUnixToDateTime(selectedEvent.recordingEndTimestamp)}</p>
					</div>
				</div>
			</div>

			<div class="mt-auto px-4 py-4 flex flex-row bg-smoke rounded-md justify-between">
				<Toggle
					numberOfButtons={numberOfVideos}
					selectedButtonIndex={selectedVideoIndex}
					setSelectedIndex={setSelectedVideoIndex}
				/>

				<button
					class="btn"
					title="Videos are stored in smaller, manageable chunks for optimal performance; use the buttons to select the desired video."
				>
					<i class="fas fa-question-circle fa-xl" />
				</button>
			</div>
		{:else}
			<div class="px-4 py-4">
				<div class="alert alert-error "><span>{getErrorText()}</span></div>
			</div>
		{/if}
	{:else}
		<div class="px-4 py-4">
			<div class="alert alert-error "><span>{getErrorText()}</span></div>
		</div>
	{/if}
</div>
