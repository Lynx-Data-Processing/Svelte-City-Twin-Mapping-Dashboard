<script lang="ts">
	import type { IMapLayer } from "../../types";
	export let layer: IMapLayer;

	const downloadGeoJSON = () => {
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(layer.geojson));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", `${layer.layerName}.geojson`);
		document.body.appendChild(downloadAnchorNode); // required for Firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	};
</script>

<button
	title="Download GeoJSON"
	on:click={downloadGeoJSON}
	class="flex flex-row gap-2 w-full h-10 justify-start px-4 bg-zinc-50 hover:bg-zinc-200 "
>
	<i class="fa-solid fa-download my-auto" />
	<p class="my-auto">Download Geojson</p>
</button>
