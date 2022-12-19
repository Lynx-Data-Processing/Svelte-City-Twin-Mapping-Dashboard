<script  lang="ts">
	import type { menuComponentsType } from '../../types/types';
	export let selectedMenu : menuComponentsType;
	export let menuComponents : menuComponentsType[];
</script>


<div class="flex flex-row">
		{#each menuComponents as menuItem}
			<button
				class={`navbar-btn  ${selectedMenu.id == menuItem.id ? 'btn-primary' : 'btn-default'} `}
				on:click={() => (selectedMenu = menuItem)}
				><i class="fa-solid {menuItem.icon} " /> {menuItem.title}
			</button>
		{/each}
</div>

