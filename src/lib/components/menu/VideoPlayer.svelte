<script lang="ts">
	import { PUBLIC_GCP_BUCKET_URL } from '$env/static/public';
	import LoadingSpinner from '$lib/components/loading/LoadingSpinner.svelte';
	import { getVideo } from '$lib/service/smarter-api';
	import type { IEventGoogleDataType, IMediaRecordingType } from '$lib/types/eventTypes';
	import { millisecondUnixToDateTime } from '$lib/utils/date-format';
	import { formatText } from '$lib/utils/text-format';
	import ButtonToggle from '../ButtonToggle.svelte';
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

<div class="flex flex-col gap-4 relative">
	{#if selectedEvent && numberOfVideos >= 0}
		<div class="flex-1 h-64">
			<video
				autoplay={true}
				class="h-auto overflow-hidden "
				controls
				height="100%"
				width="100%"
				title={`processedVideoUrl`}
				src={selectedVideo?.url}
				><track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
			</video>
		</div>

		<div class="flex flex-row gap-2 justify-between">

			<div>
				<p class="text-subtitle">Select Video</p>
				<ButtonToggle
					numberOfButtons={numberOfVideos}
					selectedButtonIndex={selectedVideoIndex}
					setSelectedIndex={setSelectedVideoIndex}
				/>
			</div>

			<div class="text-right">
				<p class="text-subtitle">Start - End</p>
				<p>{millisecondUnixToDateTime(selectedEvent.recordingStartTimestamp)}</p>
				<p>{millisecondUnixToDateTime(selectedEvent.recordingEndTimestamp)}</p>
			</div>
		
		</div>

		<hr />

		<div class="flex-1 flex flex-col justify-between gap-4">
			<div class="flex justify-between">
				<div>
					<p class="text-subtitle">Distance</p>
					<p>
						{selectedEvent.distance ? `${(selectedEvent.distance / 1000).toFixed(2)} km` : 'N/A'}
					</p>
				</div>

				<div class="text-right">
					<p class="text-subtitle">Trigger Name</p>
					<p>{formatText(selectedEvent.triggerName)}</p>
				</div>
			</div>
		</div>

		{#if loadingVideo}
			<LoadingSpinner />
		{/if}
	{:else}
		<div class="alert alert-error my-1" role="alert">{getErrorText()}</div>
	{/if}
</div>
