<script lang="ts">
	import '../styles/style.css';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	<div class="w-screen h-screen flex flex-col items-center justify-center">
		<div class="z-10 flex flex-col items-center">
			<div class="flex flex-col">
				<h1 class="font-bold text-5xl uppercase"><i class="fa-solid fa-location-arrow mr-1"/>lynx</h1>
				<h2 class="font-bold">City Mapping Dashboard</h2>
			</div>

			<Auth
				supabaseClient={data.supabase}
				view="magic_link"
				redirectTo={`${data.url}/login?redirect=/lynx-city-twin`}
				showLinks={false}
				appearance={{ theme: ThemeSupa, style: { input: 'color: #000' } }}
			/>
		</div>
	</div>
</main>