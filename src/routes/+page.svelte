<script lang="ts">
	import '../styles/style.css';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	import type { PageData } from './$types';

	export let data: PageData;

	// "Why a link? Learn More" [Visibility]
	let learnMoreVisible = false;

	function toggleLearnMore() {
		learnMoreVisible = !learnMoreVisible;
	}

</script>

<main>
	<div class="login-background">
		<div class="login-info text-white">
			<h1 class="font-sans text-6xl uppercase "><i class="fa-solid fa-location-arrow mr-5"/>lynx</h1>
			<p class="mt-12 text-lg">Cloud-based software to create and share interactive web maps.</p>
		</div>
		<div class="login-info">
			<!-- <a href="/" class="mb-auto text-right text-gray-800 hover:underline">Need Help?</a> -->
			<h1 class="font-sans text-4xl">Sign Up</h1>
			<Auth
				supabaseClient={data.supabase}
				view="magic_link"
				redirectTo={`${data.url}/login?redirect=/lynx-city-twin`}
				showLinks={false}
				appearance={{ theme: ThemeSupa, style: { input: 'color: #000', label: 'display: none' } }}
			/>
			<button 
				class="text-center hover:underline"
				on:click={toggleLearnMore}
			>
			Why a link? Learn More
			</button>
			<p class="mt-10 text-center opacity-{learnMoreVisible ? '1':'0'}">The magic link is used to access the mapping application after the authentication verifies the user has access to the application. The link grants access to an account or application without the need for a password.</p>
		</div>
		<div class="bottom-block"/>
	</div>
</main>