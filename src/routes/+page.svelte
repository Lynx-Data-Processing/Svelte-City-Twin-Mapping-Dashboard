<script lang="ts">
	import Recaptcha from '$lib/components/auth/ReCaptcha.svelte';
	import { BRAND_COLOR, BRAND_COLOR_DARK } from '$lib/constants';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { Auth } from '@supabase/auth-ui-svelte';
	import { fade } from 'svelte/transition';

	import type { PageData } from './$types';
	export let data: PageData;

	// Recaptcha status for ReCaptcha component
	let recaptcha = false;
	$: recaptchaStatus = recaptcha;

	// Learn more visibility
	let learnMoreVisible = false;
	const toggleLearnMore = () => {
		learnMoreVisible = !learnMoreVisible;
	};
</script>

<svelte:head>
	<title>Login</title>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<main class="login-background ">
	<div class="grid grid-cols-2 login-info w-2/5 h-3/5">
		<div class="col-span-1 bg-primary px-16  flex flex-col justify-center ">
			<h1 class="text-6xl text-white"><i class="fa-solid fa-location-arrow mr-5" />LYNX</h1>
			<p class="mt-12 text-lg ">Cloud-based software to create and share interactive web maps.</p>
		</div>
		<div class="col-span-1 flex flex-col">
			<div class=" flex flex-col  my-auto px-16">
				<!-- <a href="/" class="mb-auto text-right text-gray-800 hover:underline">Need Help?</a> -->
				<h1 class="mt-16  text-4xl">Sign In</h1>

				{#if recaptchaStatus}
					<span in:fade={{ duration: 500 }}>
						<Auth
							supabaseClient={data.supabase}
							view="magic_link"
							redirectTo={`${data.url}/login?redirect=/map`}
							showLinks={false}
							appearance={{
								theme: ThemeSupa,
								variables: {
									default: {
										colors: {
											brand: BRAND_COLOR,
											brandAccent: BRAND_COLOR_DARK
										}
									}
								},
								style: { input: 'color: #000', label: 'display: none' } 
							}}
						/>
					</span>
				{/if}

				{#if !recaptchaStatus}
					<span in:fade={{ duration: 500 }} class="flex flex-col">
						<Recaptcha bind:recaptcha={recaptcha}/>
					</span>
				{/if}

				<button class="text-center hover:underline" on:click={toggleLearnMore}>
					Why a link? Learn More
				</button>

				
				{#if learnMoreVisible}
					<span in:fade={{ duration: 500 }}
						>The magic link grants authorized users access to the application without the need for a
						password.</span
					>
				{/if}
			</div>

			
		</div>
	</div>
</main>
