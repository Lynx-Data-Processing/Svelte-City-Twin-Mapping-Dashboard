<script lang="ts">
	import type { IMapStyle } from '../../types/mapTypes';
	export let mapStyle: string;

	const mapStyleList: IMapStyle[] = [
		{
			id: 0,
			name: 'Streets',
			value: 'mapbox://styles/mapbox/streets-v11',
			img: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01b977fb48a501b898a93_ipad-map%20streets.png'
		},

		{
			id: 1,
			name: 'Dark',
			value: 'mapbox://styles/mapbox/dark-v10',
			img: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01810f9a5b1c55841ee6f_ipad-map%20dark.png'
		},
		{
			id: 2,
			name: 'Outdoors',
			value: 'mapbox://styles/canaleal/cle0l6bpx004501qotbnxa4wr',
			img: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01bd0779fa266f900ba3c_ipad-map%20outdoors.png'
		},
		{
			id: 3,
			name: 'Satellite',
			value: 'mapbox://styles/mapbox/satellite-streets-v11',
			img: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/6025417270820571127804d8_ipad-map.png'
		},
		{
			id: 4,
			name: 'Dark - Traffic',
			value: 'mapbox://styles/mapbox/navigation-night-v1',
			img: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01810f9a5b1c55841ee6f_ipad-map%20dark.png'
		},
		{
			id: 5,
			name: 'Light - Traffic',
			value: 'mapbox://styles/mapbox/navigation-day-v1',
			img: 'https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01b977fb48a501b898a93_ipad-map%20streets.png'
		}
	];
	const toggleStyle = (mapStyleItem: IMapStyle) => {
		mapStyle = mapStyleItem.value;
	};
</script>

<div class="flex flex-col">
	{#each mapStyleList as mapStyleItem}
		<div>
			<input
				value={mapStyleItem.value}
				type="radio"
				checked={mapStyle === mapStyleItem.value}
				on:click={() => toggleStyle(mapStyleItem)}
			/>
			<label class="ml-2" for={mapStyleItem.name}>{mapStyleItem.name}</label>
		</div>
	{/each}
</div>
