<script lang="ts">
	export let mapStyle : string;
	export let isReadyForStyleSwitching : boolean;
	let isLargeMenu :  boolean = false;
	const mapStyleList = [
		{ id: 0, name: "Streets", value: "streets-v11", img: "https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01b977fb48a501b898a93_ipad-map%20streets.png" },
		{ id: 1, name: "Dark", value: "dark-v10", img: "https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01810f9a5b1c55841ee6f_ipad-map%20dark.png" },
		{ id: 2, name: "Outdoors", value: "outdoors-v11", img: "https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01bd0779fa266f900ba3c_ipad-map%20outdoors.png" },
		{ id: 3, name: "Satellite", value: "satellite-streets-v11", img: "https://assets.website-files.com/5e83362767d71ffd59a0c8a9/6025417270820571127804d8_ipad-map.png" },
		{ id: 4, name: "Dark - Traffic", value: "navigation-night-v1", img: "https://assets.website-files.com/5e83362767d71ffd59a0c8a9/5ea01810f9a5b1c55841ee6f_ipad-map%20dark.png" },
	];
	const toggleStyle = (mapStyleValue : string) => {
		try {
			mapStyle = mapStyleValue;
			isReadyForStyleSwitching = true;
		} catch (e) {
			alert('Unable to toggle Map Style')
		}
	};
	const toggleMenu = () => {
		isLargeMenu = !isLargeMenu;
	};
</script>


<section class="card h-fit scale-in-center p-4" >
	
	<button class="card-btn  btn-black-outline my-1" on:click={toggleMenu}> <i class={`fa-solid ${isLargeMenu ? "fa-minimize" : "fa-expand"}`} /> Map Style </button>
	
	{#if isLargeMenu === true}
		<div class="flex flex-col">
			{#each mapStyleList as mapStyleItem}
			<button class={`map-style my-1 ${mapStyle === mapStyleItem.value ? "map-style-selected" : ""}`} on:click={() => toggleStyle(mapStyleItem.value)}><img class="mapstyle-img h-auto w-32" src={mapStyleItem.img} alt="" /></button>
			{/each}
		</div>
	{:else}
		{#each mapStyleList as mapStyleItem}
			<div>
				<input value={mapStyleItem.name} type="radio"  checked={mapStyle === mapStyleItem.value} on:click={() => toggleStyle(mapStyleItem.value)} />
				<label class="ml-2" for={mapStyleItem.name}>{mapStyleItem.name}</label>
			</div>
		{/each}
	{/if}
	
	
</section>

