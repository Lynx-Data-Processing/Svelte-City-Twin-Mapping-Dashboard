<script lang="ts">
	import '../styles/style.css';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	<div class="login-background">
		<div class="login-info text-white">
			<h1 class="font-sans text-7xl uppercase "><i class="fa-solid fa-location-arrow mr-5"/>lynx</h1>
			<p class="mt-12 text-lg">Cloud-based software to create and share interactive web maps.</p>
		</div>
		<div class="login-info">
			<a href="/" class="mb-auto text-right text-gray-800 hover:underline">Need Help?</a>
			<h1 class="font-sans text-4xl">Sign Up</h1>
			<Auth
				supabaseClient={data.supabase}
				view="magic_link"
				redirectTo={`${data.url}/login?redirect=/lynx-city-twin`}
				showLinks={false}
				appearance={{ theme: ThemeSupa, style: { input: 'color: #000', label: 'display: none' } }}
			/>
			<a href="/" class="mb-auto text-center text-gray-800 hover:underline">Why a link? Learn More</a>
		</div>
		<div class="bottom-block"/>
	</div>
</main>