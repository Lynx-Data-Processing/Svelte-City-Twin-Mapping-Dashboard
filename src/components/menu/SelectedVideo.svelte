<script lang="ts">
	import type { selectedEventType, videoType } from '../../types/types';

	export let selectedEvent: selectedEventType | null = null;
	export let videoArray: videoType[];
	let videoUrl: string = '';

	const updateVideoUrl = async () => {
		try {
			if (!selectedEvent) return;
			const selectedEventId = selectedEvent?.data.EventId;
			const videos = videoArray.filter((o) => o.eventId === selectedEventId);
			videoUrl = videos.length ? videos[0].videoUrl! : '';
		} catch (e) {
			console.log(e);
		}
	};

	$: selectedEvent && updateVideoUrl();
</script>

<div class="flex flex-col">
	{#if selectedEvent && videoUrl}
		<video
			class="h-96 w-full overflow-hidden rounded-lg"
			controls
			height="100%"
			width="100%"
			title={`${selectedEvent.data.EventId}`}
			src={videoUrl}
			><track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
		</video>
	{:else}
		<div class="alert alert-red my-1" role="alert">No Video selected.</div>
	{/if}
</div>
