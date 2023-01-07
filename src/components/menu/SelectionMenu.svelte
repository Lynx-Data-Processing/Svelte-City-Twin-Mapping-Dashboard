<script lang="ts">
	import type { menuComponentsType } from '../../types/types';
	export let selectedMenu: menuComponentsType;
	export let menuComponents: menuComponentsType[];
</script>

<div class="flex flex-row">
	{#each menuComponents as menuItem}
		<div class="flex flex-1">
			<button
				class={`btn  btn-no-border btn-no-rounded ${
					selectedMenu.id == menuItem.id ? 'btn-primary' : 'btn-black-outline'
				} `}
				on:click={() => (selectedMenu = menuItem)}
				><i class="fa-solid {menuItem.icon} " /> {menuItem.title}
			</button>
		</div>
	{/each}
</div>
